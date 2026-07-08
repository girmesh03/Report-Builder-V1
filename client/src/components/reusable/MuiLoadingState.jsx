/**
 * Reusable loading-state component.
 *
 * Centered CircularProgress with optional message below it.
 * Uses theme tokens — no hardcoded colors.
 *
 * @module components/reusable/MuiLoadingState
 */
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

/**
 * @param {object} props
 * @param {string} [props.message] - Text displayed below the spinner
 * @returns {JSX.Element}
 */
function MuiLoadingState({ message }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2,
      }}
    >
      <CircularProgress />
      {message && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}

MuiLoadingState.displayName = 'MuiLoadingState';

export default MuiLoadingState;
