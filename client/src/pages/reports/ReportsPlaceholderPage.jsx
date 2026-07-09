/**
 * Reports placeholder page.
 *
 * Temporary placeholder for Phase 8 implementation.
 *
 * @module pages/reports/ReportsPlaceholderPage
 */
import MuiPageHeader from '../../components/reusable/MuiPageHeader.jsx';
import MuiEmptyState from '../../components/reusable/MuiEmptyState.jsx';
import DescriptionIcon from '@mui/icons-material/Description';

/**
 * @returns {JSX.Element}
 */
function ReportsPlaceholderPage() {
  return (
    <>
      <MuiPageHeader title="Reports" subtitle="Manage your branch visit reports" />
      <MuiEmptyState
        icon={DescriptionIcon}
        title="No reports yet"
        description="Your reports will appear here. Start by creating your first report."
        actionLabel="Create Report"
        onAction={() => {}}
      />
    </>
  );
}

export default ReportsPlaceholderPage;
