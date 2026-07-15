/**
 * Report card component.
 *
 * Displays a single report summary in a card layout.
 * Delete and permanent-delete actions require confirmation dialog.
 *
 * @module components/reports/ReportCard
 */
import { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import dayjs from 'dayjs';
import ReportStatusChip from './ReportStatusChip.jsx';
import MuiDialog from '../reusable/MuiDialog.jsx';
import MuiButton from '../reusable/MuiButton.jsx';

/**
 * @param {object} props
 * @param {object} props.report
 * @param {string} props.report._id
 * @param {string} props.report.reportDate
 * @param {string} props.report.status
 * @param {string} [props.report.supervisorName]
 * @param {string} [props.report.notes]
 * @param {Array<object>} [props.report.branches]
 * @param {boolean} [props.isDeleting]
 * @param {function} onView
 * @param {function} onEdit
 * @param {function} onDelete
 * @param {function} [onArchive]
 * @param {function} [onRecover]
 * @param {function} [onPermanentDelete]
 * @param {boolean} [showArchived=false]
 * @returns {JSX.Element}
 */
function ReportCard({ report, onView, onEdit, onDelete, onArchive, onRecover, onPermanentDelete, isDeleting, showArchived = false }) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null);

  const branchNames = (report.branches || []).map((b) => b.name).join(', ');

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

  return (
    <>
      <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <ReportStatusChip status={report.status} sx={{ mb: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 14 }} />
            {dayjs(report.reportDate).format('MMM D, YYYY')}
          </Typography>
          {branchNames && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccountTreeIcon sx={{ fontSize: 14 }} />
              {branchNames}
            </Typography>
          )}
          {report.supervisorName && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              {report.supervisorName}
            </Typography>
          )}
          {report.notes && (
            <Typography variant="body2" color="text.secondary" sx={{
              mt: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {report.notes}
            </Typography>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', px: 1, pb: 1 }}>
          {report.archivedAt || report.status === 'archived' ? (
            <>
              <Tooltip title="Recover report">
                <span>
                  <IconButton size="small" sx={{ color: 'success.main' }} onClick={() => onRecover(report._id)}>
                    <UnarchiveIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Permanently delete">
                <span>
                  <IconButton size="small" sx={{ color: 'error.main' }} onClick={() => setPermanentDeleteTarget(report._id)}>
                    <DeleteForeverIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="View details">
                <span>
                  <IconButton size="small" onClick={() => onView(report._id)}>
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              {onEdit && (
                <Tooltip title="Edit report">
                  <span>
                    <IconButton size="small" sx={{ color: 'warning.main' }} onClick={() => onEdit(report)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              {report.status === 'draft' && (
                <Tooltip title="Delete report">
                  <span>
                    <IconButton size="small" sx={{ color: 'error.main' }} onClick={() => setDeleteTarget(report._id)} disabled={isDeleting}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              {report.status !== 'draft' && onArchive && (
                <Tooltip title="Archive report">
                  <span>
                    <IconButton size="small" sx={{ color: 'grey.500' }} onClick={() => onArchive(report._id)}>
                      <ArchiveIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </>
          )}
        </CardActions>
      </Card>

      <MuiDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
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

      <MuiDialog open={Boolean(permanentDeleteTarget)} onClose={() => setPermanentDeleteTarget(null)}>
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

export default ReportCard;
