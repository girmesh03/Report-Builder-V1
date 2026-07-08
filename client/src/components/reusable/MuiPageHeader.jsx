/**
 * Reusable page header component.
 *
 * Renders a title (h4), optional subtitle (body2, text.secondary),
 * and an optional action slot on the right. Responsive layout
 * wraps on small screens.
 *
 * @module components/reusable/MuiPageHeader
 */
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/**
 * @param {object} props
 * @param {string} props.title - Page heading text
 * @param {string} [props.subtitle] - Secondary text below the title
 * @param {React.ReactNode} [props.action] - Element rendered on the right (button, menu, etc.)
 * @returns {JSX.Element}
 */
function MuiPageHeader({ title, subtitle, action }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3,
      }}
    >
      <Box sx={{ flex: '1 1 auto' }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && (
        <Box sx={{ flexShrink: 0 }}>
          {action}
        </Box>
      )}
    </Box>
  );
}

MuiPageHeader.displayName = 'MuiPageHeader';

export default MuiPageHeader;
