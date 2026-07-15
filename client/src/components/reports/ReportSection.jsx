/**
 * Report section component.
 *
 * Renders a single labelled section of the report with a header
 * label and content. Supports Amharic text with proper line-break
 * preservation and overflow handling.
 *
 * @module components/reports/ReportSection
 */
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/**
 * @param {object} props
 * @param {string} props.label - Section header label (e.g. "የተሰሩ ስራዎች")
 * @param {string} props.content - Section content text
 * @param {boolean} [props.boldLabel=true]
 */
function ReportSection({ label, content, boldLabel = true }) {
  if (!content) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle2"
        fontWeight={boldLabel ? 700 : 600}
        sx={{ mb: 0.5, color: 'text.secondary' }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          lineHeight: 1.7,
        }}
      >
        {content}
      </Typography>
    </Box>
  );
}

export default ReportSection;
