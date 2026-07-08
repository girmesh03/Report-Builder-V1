/**
 * Protected route guard.
 *
 * Redirects unauthenticated users to the login page.
 * Shows a loading spinner while auth state is being initialised.
 *
 * @module routes/ProtectedRoute
 */
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ROUTE_PATHS } from '../utils/routePaths.js';

/**
 * @returns {JSX.Element}
 */
function ProtectedRoute() {
  const { isAuthenticated, initializing } = useSelector((state) => state.auth);

  if (initializing) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
