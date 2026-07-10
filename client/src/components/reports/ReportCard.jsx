/**
 * Report card component.
 *
 * Displays a single report summary in a card layout.
 *
 * @module components/reports/ReportCard
 */
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import dayjs from 'dayjs';
import ReportStatusChip from './ReportStatusChip.jsx';

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
 * @param {function} onDelete
 * @returns {JSX.Element}
 */
function ReportCard({ report, onView, onDelete, isDeleting }) {
  const branchNames = (report.branches || []).map((b) => b.name).join(', ');

  return (
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
        <Tooltip title="View details">
          <IconButton size="small" onClick={() => onView(report._id)}>
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {report.status === 'draft' && (
          <Tooltip title="Delete report">
            <IconButton size="small" color="error" onClick={() => onDelete(report._id)} disabled={isDeleting}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
}

export default ReportCard;
