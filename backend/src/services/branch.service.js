/**
 * Branch business logic.
 *
 * @module services/branch
 */
import Branch from '../models/branch.model.js';
import ApiError from '../utils/apiError.js';
import httpStatus from '../utils/httpStatus.js';
import constants from '../utils/constants.js';

/**
 * List branches with pagination, search, and sorting.
 *
 * @param {object} query - Query parameters
 * @param {number} [query.page=1]
 * @param {number} [query.limit=10]
 * @param {string} [query.sort]
 * @param {string} [query.search] - Search by name or code
 * @param {object} [options] - { session }
 * @returns {Promise<object>} Paginated result
 */
export const listBranches = async (query, options = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || constants.PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    constants.PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit, 10) || constants.PAGINATION.DEFAULT_LIMIT),
  );
  const sort = query.sort || '-createdAt';

  const filter = {};
  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.$or = [{ name: regex }, { code: regex }];
  }

  const result = await Branch.paginate(filter, {
    page,
    limit,
    sort,
    session: options.session || null,
  });

  return result;
};

/**
 * Get a single branch by ID.
 *
 * @param {string} id - Branch ID
 * @returns {Promise<object>}
 * @throws {ApiError} 404 if not found
 */
export const getBranchById = async (id) => {
  const branch = await Branch.findById(id);
  if (!branch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Branch not found');
  }
  return branch;
};

/**
 * Create a new branch.
 *
 * @param {object} data - Branch data
 * @param {object} [options] - { session }
 * @returns {Promise<object>}
 * @throws {ApiError} 409 if code already exists
 */
export const createBranch = async (data, options = {}) => {
  const session = options.session || null;

  const existing = await Branch.findOne({ code: data.code }).session(session);
  if (existing) {
    throw new ApiError(httpStatus.CONFLICT, 'Branch code already exists');
  }

  const [branch] = await Branch.create([data], { session });
  return branch;
};

/**
 * Update a branch.
 *
 * @param {string} id - Branch ID
 * @param {object} updates - Fields to update
 * @param {object} [options] - { session }
 * @returns {Promise<object>}
 * @throws {ApiError} 404 if not found
 * @throws {ApiError} 409 if code conflicts with another branch
 */
export const updateBranch = async (id, updates, options = {}) => {
  const session = options.session || null;

  if (updates.code) {
    const conflicting = await Branch.findOne({ code: updates.code, _id: { $ne: id } }).session(session);
    if (conflicting) {
      throw new ApiError(httpStatus.CONFLICT, 'Branch code already in use');
    }
  }

  const branch = await Branch.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
    session,
  });

  if (!branch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Branch not found');
  }

  return branch;
};

/**
 * Deactivate (soft delete) a branch.
 *
 * @param {string} id - Branch ID
 * @param {object} [options] - { session }
 * @returns {Promise<object>}
 * @throws {ApiError} 404 if not found
 */
export const deactivateBranch = async (id, options = {}) => {
  const session = options.session || null;

  const branch = await Branch.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true, session },
  );

  if (!branch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Branch not found');
  }

  return branch;
};
