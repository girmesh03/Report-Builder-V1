/**
 * Public route guard.
 *
 * Redirects authenticated users to the dashboard.
 * Shows a loading spinner while auth state is being initialised.
 * Wrap any public page route with this to prevent authenticated access.
 *
 * @module routes/PublicRoute
 */
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ROUTE_PATHS } from '../utils/routePaths.js';

/**
 * @returns {JSX.Element}
 */
function PublicRoute() {
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

  if (isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.DASHBOARD} replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
