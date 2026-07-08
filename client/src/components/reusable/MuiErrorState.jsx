/**
 * Reusable error-state component.
 *
 * Centered ErrorOutlineIcon (56px, error.main), title (h6),
 * message (body2, text.secondary), and optional retry button.
 * Theme-aware sx — no direct themePrimitives imports.
 *
 * @module components/reusable/MuiErrorState
 */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * @param {object} props
 * @param {string} [props.title='Something went wrong'] - Heading text
 * @param {string} [props.message] - Supporting detail
 * @param {() => void} [props.onRetry] - Retry click handler
 * @param {string} [props.retryLabel='Try again'] - Retry button label
 * @returns {JSX.Element}
 */
function MuiErrorState({ title = 'Something went wrong', message, onRetry, retryLabel = 'Try again' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 56, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {message && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 400 }}>
          {message}
        </Typography>
      )}
      {onRetry && (
        <Button variant="outlined" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </Box>
  );
}

MuiErrorState.displayName = 'MuiErrorState';

export default MuiErrorState;
