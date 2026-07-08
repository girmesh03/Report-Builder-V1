/**
 * Application error boundary component.
 *
 * Wraps react-error-boundary's ErrorBoundary with a fallback UI.
 *
 * @module components/feedback/AppErrorBoundary
 */
import { ErrorBoundary } from 'react-error-boundary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

/**
 * Fallback UI displayed when an error is caught.
 *
 * @param {{ error: Error, resetErrorBoundary: Function }} props
 * @returns {JSX.Element}
 */
function FallbackComponent({ error, resetErrorBoundary }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {error.message}
      </Typography>
      <Button variant="contained" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </Box>
  );
}

/**
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
function AppErrorBoundary({ children }) {
  return <ErrorBoundary FallbackComponent={FallbackComponent}>{children}</ErrorBoundary>;
}

export default AppErrorBoundary;
