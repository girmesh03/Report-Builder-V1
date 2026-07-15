/**
 * Reports data grid.
 *
 * Displays reports in a MUI Data Grid with server-side pagination,
 * row selection checkboxes, and action column (view/edit/delete)
 * with icon-only buttons, tooltips, and delete confirmation dialog.
 *
 * @module components/reports/ReportsDataGrid
 */
import { useState, useCallback } from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MuiDialog from '../reusable/MuiDialog.jsx';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MuiButton from '../reusable/MuiButton.jsx';
import MuiDataGrid from '../reusable/MuiDataGrid.jsx';
import ReportStatusChip from './ReportStatusChip.jsx';

const REPORT_STATUSES = [
  'draft',
  'audio_recorded',
  'transcribed',
  'transcription_reviewed',
  'generated',
  'finalized',
  'exported',
];

function DataGridErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography color="error" variant="h6">Data Grid Error</Typography>
      <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
        {error?.message || 'An unexpected error occurred'}
      </Typography>
      <MuiButton onClick={resetErrorBoundary} variant="outlined" size="small" sx={{ mt: 2 }}>
        Retry
      </MuiButton>
    </Box>
  );
}

/**
 * @param {object} props
 * @param {Array<object>} props.reports
 * @param {number} props.totalDocs
 * @param {number} [props.page=1]
 * @param {number} [props.limit=10]
 * @param {function} onPageChange
 * @param {function} onView
 * @param {function} onEdit
 * @param {function} onDelete
 * @param {function} onArchive
 * @param {function} onRecover
 * @param {function} onPermanentDelete
 * @param {boolean} isDeleting
 * @param {boolean} [showArchived=false]
 * @returns {JSX.Element}
 */
function ReportsDataGrid({ reports = [], totalDocs = 0, page = 1, limit = 10, onPageChange, onView, onEdit, onDelete, onArchive, onRecover, onPermanentDelete, isDeleting, showArchived = false }) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null);

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) {
      onDelete(deleteTarget);
      setDeleteTarget(null);
    }
  }, [deleteTarget, onDelete]);

  const handleConfirmPermanentDelete = useCallback(() => {
    if (permanentDeleteTarget) {
      onPermanentDelete(permanentDeleteTarget);
      setPermanentDeleteTarget(null);
    }
  }, [permanentDeleteTarget, onPermanentDelete]);

  const columns = [
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: ({ value }) => <ReportStatusChip status={value} />,
    },
    {
      field: 'reportDate',
      headerName: 'Date',
      width: 120,
      valueFormatter: (value) => value ? dayjs(value).format('MMM D, YYYY') : '',
    },
    {
      field: 'branches',
      headerName: 'Branches',
      flex: 1,
      minWidth: 180,
      valueGetter: (value) => (value || []).map((b) => b.name).join(', '),
    },
    {
      field: 'supervisorName',
      headerName: 'Supervisor',
      width: 140,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: showArchived ? 160 : 160,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => {
        const isArchived = row.archivedAt || row.status === 'archived';

        return (
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            {isArchived ? (
              <>
                <Tooltip title="Recover report">
                  <span>
                    <IconButton size="small" sx={{ color: 'success.main' }} onClick={() => onRecover(row._id)}>
                      <UnarchiveIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Permanently delete">
                  <span>
                    <IconButton size="small" sx={{ color: 'error.main' }} onClick={() => setPermanentDeleteTarget(row._id)}>
                      <DeleteForeverIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="View report">
                  <span>
                    <IconButton size="small" sx={{ color: 'primary.main' }} onClick={() => onView(row._id)}>
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Edit report">
                  <span>
                    <IconButton size="small" sx={{ color: 'warning.main' }} onClick={() => onEdit(row)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Delete report">
                  <span>
                    <IconButton
                      size="small"
                      sx={{ color: 'error.main' }}
                      onClick={() => setDeleteTarget(row._id)}
                      disabled={row.status !== 'draft' || isDeleting}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                {row.status !== 'draft' && (
                  <Tooltip title="Archive report">
                    <span>
                      <IconButton size="small" sx={{ color: 'grey.500' }} onClick={() => onArchive(row._id)}>
                        <ArchiveIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </>
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <>
      <div style={{ height: 500, width: '100%' }}>
        <MuiDataGrid
          rows={reports}
          columns={columns}
          getRowId={(row) => row._id}
          pagination
          paginationMode="server"
          rowCount={totalDocs}
          pageSizeOptions={[limit]}
          paginationModel={{ page: page - 1, pageSize: limit }}
          onPaginationModelChange={(model) => onPageChange(model)}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
      <MuiDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>Delete Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this draft report? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setDeleteTarget(null)} color="inherit" size="small">Cancel</MuiButton>
          <MuiButton onClick={handleConfirmDelete} color="error" variant="contained" disabled={isDeleting} size="small">
            Delete
          </MuiButton>
        </DialogActions>
      </MuiDialog>
      <MuiDialog
        open={Boolean(permanentDeleteTarget)}
        onClose={() => setPermanentDeleteTarget(null)}
      >
        <DialogTitle>Permanently Delete Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action permanently deletes the report and all associated audio files. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setPermanentDeleteTarget(null)} color="inherit" size="small">Cancel</MuiButton>
          <MuiButton onClick={handleConfirmPermanentDelete} color="error" variant="contained" size="small">
            Permanently Delete
          </MuiButton>
        </DialogActions>
      </MuiDialog>
    </>
  );
}

export { REPORT_STATUSES };
export default withErrorBoundary(ReportsDataGrid, {
  FallbackComponent: DataGridErrorFallback,
  onError: (error) => console.error('ReportsDataGrid error:', error),
});
