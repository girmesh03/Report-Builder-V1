/**
 * Report status chip.
 *
 * Maps report status to a colored MUI Chip.
 *
 * @module components/reports/ReportStatusChip
 */
import Chip from '@mui/material/Chip';

const STATUS_CONFIG = Object.freeze({
  draft: { label: 'Draft', color: 'default' },
  audio_recorded: { label: 'Audio Recorded', color: 'info' },
  transcribed: { label: 'Transcribed', color: 'secondary' },
  transcription_reviewed: { label: 'Reviewed', color: 'warning' },
  generated: { label: 'Generated', color: 'primary' },
  finalized: { label: 'Finalized', color: 'success' },
  exported: { label: 'Exported', color: 'success' },
});

/**
 * @param {object} props
 * @param {string} props.status
 * @param {object} [props.sx]
 * @returns {JSX.Element}
 */
function ReportStatusChip({ status, sx }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'default' };
  return <Chip label={config.label} color={config.color} size="small" sx={sx} />;
}

export default ReportStatusChip;
