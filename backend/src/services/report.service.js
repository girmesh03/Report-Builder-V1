/**
 * Report business logic.
 *
 * @module services/report
 */
import Report from '../models/report.model.js';
import ApiError from '../utils/apiError.js';
import httpStatus from '../utils/httpStatus.js';
import constants from '../utils/constants.js';

/**
 * List reports with pagination, search, status/branch/date filtering.
 *
 * @param {object} query - Query parameters
 * @param {string} query.userId - User ID for ownership filter
 * @param {number} [query.page=1]
 * @param {number} [query.limit=10]
 * @param {string} [query.sort]
 * @param {string} [query.search] - Search by supervisorName or notes
 * @param {string} [query.status] - Filter by status
 * @param {string} [query.branch] - Filter by branch ID
 * @param {string} [query.dateFrom] - Filter reports on or after this date
 * @param {string} [query.dateTo] - Filter reports on or before this date
 * @param {object} [options] - { session }
 * @returns {Promise<object>} Paginated result
 */
export const listReports = async (query, options = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || constants.PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    constants.PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit, 10) || constants.PAGINATION.DEFAULT_LIMIT),
  );
  const sort = query.sort || '-createdAt';

  const filter = { user: query.userId };

  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.$or = [{ supervisorName: regex }, { notes: regex }];
  }

  if (query.status && Object.values(constants.REPORT_STATUS).includes(query.status)) {
    filter.status = query.status;
  }

  if (query.branch) {
    filter.branches = query.branch;
  }

  if (query.dateFrom || query.dateTo) {
    filter.reportDate = {};
    if (query.dateFrom) {
      filter.reportDate.$gte = new Date(query.dateFrom);
    }
    if (query.dateTo) {
      filter.reportDate.$lte = new Date(query.dateTo);
    }
  }

  const result = await Report.paginate(filter, {
    page,
    limit,
    sort,
    populate: { path: 'branches', select: 'name code' },
    session: options.session || null,
  });

  return result;
};

/**
 * Get a single report by ID, scoped to the owning user.
 *
 * @param {string} id - Report ID
 * @param {string} userId - Owning user ID
 * @returns {Promise<object>}
 * @throws {ApiError} 404 if not found or not owned
 */
export const getReportById = async (id, userId) => {
  const report = await Report.findOne({ _id: id, user: userId }).populate('branches', 'name code');
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  return report;
};

/**
 * Create a new report (draft).
 *
 * Only date, branches, and user are required. Title is auto-generated.
 *
 *
 * @param {object} data - { reportDate, branches }
 * @param {object} authUser - Authenticated user document
 * @param {object} [options] - { session }
 * @returns {Promise<object>}
 */
export const createReport = async (data, authUser, options = {}) => {
  const session = options.session || null;

  const reportData = {
    user: authUser._id,
    reportDate: data.reportDate,
    branches: data.branches || [],
    supervisorName: authUser.name,
    status: constants.REPORT_STATUS.DRAFT,
  };

  const [report] = await Report.create([reportData], { session });
  return report;
};

/**
 * Update a report, scoped to the owning user.
 *
 * @param {string} id - Report ID
 * @param {string} userId - Owning user ID
 * @param {object} updates - Fields to update
 * @param {object} [options] - { session }
 * @returns {Promise<object>}
 * @throws {ApiError} 404 if not found
 */
export const updateReport = async (id, userId, updates, options = {}) => {
  const session = options.session || null;

  const report = await Report.findOneAndUpdate(
    { _id: id, user: userId },
    updates,
    { new: true, runValidators: true, session },
  );

  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }

  return report;
};

/**
 * Delete a report, scoped to the owning user.
 * Only draft reports can be deleted.
 *
 * @param {string} id - Report ID
 * @param {string} userId - Owning user ID
 * @param {object} [options] - { session }
 * @returns {Promise<object>}
 * @throws {ApiError} 404 if not found
 * @throws {ApiError} 400 if report is not in draft status
 */
export const deleteReport = async (id, userId, options = {}) => {
  const session = options.session || null;

  const report = await Report.findOne({ _id: id, user: userId }).session(session);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }

  if (report.status !== constants.REPORT_STATUS.DRAFT) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Only draft reports can be deleted');
  }

  await report.deleteOne({ session });
  return report;
};

/**
 * Generate a monthly summary report compiled from all reports in a given month.
 *
 * Collects all reports for the specified month/year, groups them by branch,
 * and returns a compilation structure ready for AI summarization.
 *
 * @param {string} userId - Owning user ID
 * @param {number} year - Calendar year
 * @param {number} month - Calendar month (1-12)
 * @param {object} [options] - { session }
 * @returns {Promise<object>} Monthly compilation
 */
export const generateMonthlyReport = async (userId, year, month, options = {}) => {
  const session = options.session || null;

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const reports = await Report.find({
    user: userId,
    reportDate: { $gte: startDate, $lte: endDate },
  })
    .populate('branches', 'name code')
    .sort({ reportDate: -1 })
    .session(session);

  const totalReports = reports.length;
  const statusCounts = {};
  for (const s of Object.values(constants.REPORT_STATUS)) {
    statusCounts[s] = reports.filter((r) => r.status === s).length;
  }

  const branchMap = {};
  for (const report of reports) {
    for (const branch of report.branches) {
      const key = branch._id.toString();
      if (!branchMap[key]) {
        branchMap[key] = { branch: { name: branch.name, code: branch.code }, count: 0 };
      }
      branchMap[key].count++;
    }
  }

  return {
    year,
    month,
    totalReports,
    statusCounts,
    branchBreakdown: Object.values(branchMap),
    reports,
    aiGenerated: false,
  };
};

/**
 * Retrieve all reports within a date range for export.
 *
 * @param {string} userId - Owning user ID
 * @param {string} dateFrom - Start date (ISO string)
 * @param {string} dateTo - End date (ISO string)
 * @param {object} [options] - { session }
 * @returns {Promise<object>} Export data with report collection and metadata
 */
export const exportReportsByDateRange = async (userId, dateFrom, dateTo, options = {}) => {
  const session = options.session || null;

  const filter = { user: userId, reportDate: {} };

  if (dateFrom) {
    filter.reportDate.$gte = new Date(dateFrom);
  }

  if (dateTo) {
    filter.reportDate.$lte = new Date(dateTo);
  }

  const reports = await Report.find(filter)
    .populate('branches', 'name code')
    .sort({ reportDate: -1 })
    .session(session);

  return {
    total: reports.length,
    dateFrom: dateFrom || null,
    dateTo: dateTo || null,
    exportedAt: new Date().toISOString(),
    reports,
  };
};
