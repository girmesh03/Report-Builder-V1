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
 * @param {function} onDelete
 * @param {boolean} isDeleting
 * @returns {JSX.Element}
 */
function ReportsCardList({ reports, onView, onDelete, isDeleting }) {
  return (
    <Grid container spacing={2}>
      {reports.map((report) => (
        <Grid key={report._id} size={{ xs: 12, sm: 6, md: 4 }}>
          <ReportCard
            report={report}
            onView={onView}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default ReportsCardList;
