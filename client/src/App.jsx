/**
 * Root App component.
 *
 * Renders theme, CssBaseline, error boundary, toast container,
 * dispatches fetchCurrentUser on mount, and renders child routes.
 *
 * @module App
 */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router';
import CssBaseline from '@mui/material/CssBaseline';
import AppThemeProvider from './providers/AppThemeProvider.jsx';
import AppErrorBoundary from './components/feedback/AppErrorBoundary.jsx';
import AppToastContainer from './components/feedback/AppToastContainer.jsx';
import { fetchCurrentUser } from './store/authSlice.js';

/**
 * @returns {JSX.Element}
 */
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <AppThemeProvider>
      <CssBaseline />
      <AppErrorBoundary>
        <AppToastContainer />
        <Outlet />
      </AppErrorBoundary>
    </AppThemeProvider>
  );
}

export default App;
