/**
 * Protected route guard.
 *
 * Redirects unauthenticated users to the login page.
 * Shows a loading spinner while auth state is being initialised.
 * Auth hydration (fetchCurrentUser) is dispatched by App.jsx on mount.
 *
 * @module routes/ProtectedRoute
 */
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ROUTE_PATHS } from '../utils/routePaths.js';

/**
 * @returns {JSX.Element}
 */
function ProtectedRoute() {
  const location = useLocation();
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
    return <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
