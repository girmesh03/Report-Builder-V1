/**
 * Report finalize bar component.
 *
 * Action bar displayed at the bottom of the report preview/editor
 * that allows the user to finalize a generated/edited report.
 * Shows a confirmation prompt before finalizing.
 *
 * @module components/reports/ReportFinalizeBar
 */
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MuiButton from '../reusable/MuiButton.jsx';
import MuiDialog from '../reusable/MuiDialog.jsx';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * @param {object} props
 * @param {string} props.status - Current report status
 * @param {boolean} [props.finalizing] - Whether finalize is in progress
 * @param {boolean} [props.hasContent] - Whether the report has generated/edited content
 * @param {() => void} props.onFinalize - Called when finalization is confirmed
 */
function ReportFinalizeBar({ status, finalizing, hasContent, onFinalize }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (status === 'finalized' || status === 'exported') {
    return (
      <Alert severity="success" sx={{ mt: 2 }}>
        {status === 'finalized' ? 'Report has been finalized.' : 'Report has been exported.'}
      </Alert>
    );
  }

  if (status !== 'generated') return null;

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end', alignItems: 'center' }}>
        {!hasContent && (
          <Typography variant="caption" color="text.secondary">
            Finalization requires generated report content.
          </Typography>
        )}
        <MuiButton
          variant="contained"
          color="primary"
          disabled={!hasContent || finalizing}
          loading={finalizing}
          loadingIndicator={<CircularProgress size={20} />}
          loadingPosition="center"
          onClick={() => setConfirmOpen(true)}
          size="small"
        >
          Finalize Report
        </MuiButton>
      </Stack>

      <MuiDialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Finalize Report</DialogTitle>
        <DialogContent>
          <Typography>Once finalized, the report will no longer be editable. Export will be available after finalization. Are you sure you want to finalize this report?</Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton variant="outlined" onClick={() => setConfirmOpen(false)} size="small">Cancel</MuiButton>
          <MuiButton variant="contained" onClick={() => { setConfirmOpen(false); onFinalize(); }} disabled={finalizing} loading={finalizing} loadingIndicator={<CircularProgress size={20} />} loadingPosition="center" size="small">Confirm Finalize</MuiButton>
        </DialogActions>
      </MuiDialog>
    </>
  );
}

export default ReportFinalizeBar;
