/**
 * Reports page.
 *
 * Main reports listing page with list/grid view toggle,
 * filter dialog, pagination, create/edit report dialog.
 *
 * @module pages/reports/ReportsPage
 */
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import MuiPagination from '../../components/reusable/MuiPagination.jsx';

import MuiLoadingState from '../../components/reusable/MuiLoadingState.jsx';
import MuiEmptyState from '../../components/reusable/MuiEmptyState.jsx';
import MuiErrorState from '../../components/reusable/MuiErrorState.jsx';
import ReportsToolbar from '../../components/reports/ReportsToolbar.jsx';
import ReportsCardList from '../../components/reports/ReportsCardList.jsx';
import ReportsDataGrid from '../../components/reports/ReportsDataGrid.jsx';
import ReportMetadataDialog from '../../components/reports/ReportMetadataDialog.jsx';
import ReportsFilterDialog from '../../components/reports/ReportsFilterDialog.jsx';
import { fetchReports, createReport, updateReport, deleteReport, archiveReport, recoverReport, permanentDeleteReport } from '../../store/reportsSlice.js';
import { fetchBranches } from '../../store/branchesSlice.js';
import DescriptionIcon from '@mui/icons-material/Description';

/**
 * @returns {JSX.Element}
 */
function ReportsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { reports, totalDocs, totalPages, page, loading, error, createLoading, deleteLoading } =
    useSelector((state) => state.reports);
  const { branches, loading: branchesLoading } = useSelector((state) => state.branches);

  const [viewMode, setViewMode] = useState('list');
  const [showArchived, setShowArchived] = useState(false);
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  const loadReports = useCallback((overrideFilters = {}) => {
    const merged = { ...filters, ...overrideFilters };
    const cleanParams = {};
    Object.entries(merged).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleanParams[key] = value;
      }
    });
    if (showArchived) {
      cleanParams.showArchived = 'true';
    }
    dispatch(fetchReports(cleanParams));
  }, [dispatch, filters, showArchived]);

  useEffect(() => {
    loadReports();
  }, [filters.page, filters.status, filters.branch, filters.dateFrom, filters.dateTo, showArchived]);

  useEffect(() => {
    if (branches.length === 0 && !branchesLoading) {
      dispatch(fetchBranches({ limit: 100 }));
    }
  }, []);

  const handlePageChange = useCallback((_e, newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleDataGridPageChange = useCallback((model) => {
    setFilters((prev) => ({ ...prev, page: model.page + 1 }));
  }, []);

  const handleView = useCallback((id) => {
    navigate(`/reports/${id}/preview`);
  }, [navigate]);

  const handleEdit = useCallback((report) => {
    navigate(`/reports/${report._id}/edit`);
  }, [navigate]);

  const handleDelete = useCallback((id) => {
    dispatch(deleteReport(id));
  }, [dispatch]);

  const handleArchive = useCallback((id) => {
    dispatch(archiveReport(id));
  }, [dispatch]);

  const handleRecover = useCallback((id) => {
    dispatch(recoverReport(id));
  }, [dispatch]);

  const handlePermanentDelete = useCallback((id) => {
    dispatch(permanentDeleteReport(id));
  }, [dispatch]);

  const handleCreateSubmit = useCallback(async (data) => {
    if (editingReport) {
      const result = await dispatch(updateReport({ id: editingReport._id, data }));
      if (result.meta.requestStatus === 'fulfilled') {
        setDialogOpen(false);
        setEditingReport(null);
        loadReports();
      }
    } else {
      const result = await dispatch(createReport(data));
      if (result.meta.requestStatus === 'fulfilled') {
        setDialogOpen(false);
        loadReports({ page: 1 });
      }
    }
  }, [dispatch, editingReport, loadReports]);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setEditingReport(null);
  }, []);

  const handleFilterApply = useCallback((filterValues) => {
    setFilters((prev) => {
      const next = { ...prev, ...filterValues, page: 1 };
      Object.keys(next).forEach((key) => {
        if (next[key] === '' || next[key] === null || next[key] === undefined) {
          delete next[key];
        }
      });
      return next;
    });
  }, []);

  const handleFilterClear = useCallback(() => {
    setFilters({ page: 1, limit: 10 });
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status) count++;
    if (filters.branch) count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  }, [filters]);

  let content;

  if (loading) {
    content = <MuiLoadingState message="Loading reports..." />;
  } else if (error && reports.length === 0) {
    content = <MuiErrorState message={error} onRetry={() => loadReports()} />;
  } else if (!loading && reports.length === 0) {
    content = (
      <MuiEmptyState
        icon={DescriptionIcon}
        title="No reports yet"
        description="Start by creating your first report."
        actionLabel="Create Report"
        onAction={() => { setEditingReport(null); setDialogOpen(true); }}
      />
    );
  } else if (viewMode === 'grid') {
    content = (
      <ReportsDataGrid
        reports={reports}
        totalDocs={totalDocs}
        page={page}
        limit={10}
        onPageChange={handleDataGridPageChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onArchive={handleArchive}
        onRecover={handleRecover}
        onPermanentDelete={handlePermanentDelete}
        isDeleting={deleteLoading}
        showArchived={showArchived}
      />
    );
  } else {
    content = (
      <>
        <ReportsCardList
          reports={reports}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onRecover={handleRecover}
          onPermanentDelete={handlePermanentDelete}
          isDeleting={deleteLoading}
          showArchived={showArchived}
        />
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <MuiPagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
            />
          </Box>
        )}
      </>
    );
  }

  return (
    <>
      <ReportsToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onFilterClick={() => setFilterOpen(true)}
        activeFilterCount={activeFilterCount}
        onCreateClick={() => { setEditingReport(null); setDialogOpen(true); }}
        showArchived={showArchived}
        onShowArchivedChange={setShowArchived}
      />
      {content}
      <ReportsFilterDialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
        initialFilters={{
          status: filters.status || '',
          branch: filters.branch || '',
          dateFrom: filters.dateFrom || '',
          dateTo: filters.dateTo || '',
        }}
        branches={branches}
      />
      <ReportMetadataDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleCreateSubmit}
        branches={branches}
        isLoading={createLoading}
        initialData={editingReport}
      />
    </>
  );
}

export default ReportsPage;
