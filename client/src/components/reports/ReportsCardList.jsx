/**
 * Reports card list.
 *
 * Renders a responsive grid of ReportCard components.
 *
 * @module components/reports/ReportsCardList
 */
import Grid from '@mui/material/Grid';
import ReportCard from './ReportCard.jsx';

/**
 * @param {object} props
 * @param {Array<object>} props.reports
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
function ReportsCardList({ reports, onView, onEdit, onDelete, onArchive, onRecover, onPermanentDelete, isDeleting, showArchived = false }) {
  return (
    <Grid container spacing={2}>
      {reports.map((report) => (
        <Grid key={report._id} size={{ xs: 12, sm: 6, md: 4 }}>
          <ReportCard
            report={report}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
            onRecover={onRecover}
            onPermanentDelete={onPermanentDelete}
            isDeleting={isDeleting}
            showArchived={showArchived}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default ReportsCardList;
