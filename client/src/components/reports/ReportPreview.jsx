/**
 * Report preview component.
 *
 * Displays the full generated report content in a structured,
 * read-only format with labelled sections. Supports Amharic text
 * with proper font rendering, line-break preservation, and
 * mobile-safe overflow handling.
 *
 * @module components/reports/ReportPreview
 */
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ReportSection from './ReportSection.jsx';

/**
 * Parses a generated report text into labelled sections.
 *
 * Expected format:
 *   ቀን: [value]
 *   ብራንች: [value]
 *   ስም: [value]
 *   ስራ የገባሁበት ሰዓት: [value(s)]
 *   የተሰሩ ስራዎች: [content]
 *   መፍትሄ የሚፈሉ ጉዳዮች: [content]
 *   አጠቃላይ አስተያየት: [content]
 *   ከስራ የወጣሁበት ሰዓት: [value]
 *
 * Falls back to displaying the raw text as a single block
 * if parsing does not match the expected structure.
 *
 * @param {object} props
 * @param {string} props.reportText - The generated or edited report text
 */
function ReportPreview({ reportText }) {
  if (!reportText || !reportText.trim()) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        No report content available.
      </Typography>
    );
  }

  const lines = reportText.split('\n');
  const headerFields = [];
  const sections = [];
  let currentSection = null;
  let headerDone = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line) {
      if (currentSection) {
        sections.push(currentSection);
        currentSection = null;
        headerDone = true;
      }
      continue;
    }

    const headerMatch = line.match(/^(ቀን|ብራንች|ስም|ስራ የገባሁበት ሰዓት|ከስራ የወጣሁበት ሰዓት)\s*[:፡]\s*(.*)/);
    if (headerMatch && !headerDone) {
      headerFields.push({ label: headerMatch[1], value: headerMatch[2] });
      continue;
    }

    const sectionMatch = line.match(/^(የተሰሩ ስራዎች|መፍትሄ የሚፈሉ ጉዳዮች|አጠቃላይ አስተያየት)\s*[:፡]?\s*/);
    if (sectionMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { label: sectionMatch[1], content: line.slice(sectionMatch[0].length) };
      headerDone = true;
      continue;
    }

    if (currentSection) {
      currentSection.content += (currentSection.content ? '\n' : '') + line;
    } else if (headerDone) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { label: '', content: line };
      sections.push(currentSection);
      currentSection = null;
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return (
    <Box>
      {headerFields.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {headerFields.map((field) => (
            <Typography key={field.label} variant="body2" sx={{ mb: 0.5 }}>
              <strong>{field.label}:</strong> {field.value}
            </Typography>
          ))}
        </Box>
      )}

      {sections.length > 0 ? (
        sections.map((section, idx) => (
          <ReportSection
            key={section.label || `section-${idx}`}
            label={section.label}
            content={section.content}
          />
        ))
      ) : (
        <Typography
          variant="body2"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            lineHeight: 1.7,
          }}
        >
          {reportText}
        </Typography>
      )}
    </Box>
  );
}

export default ReportPreview;
