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
import AppTheme from './theme/AppTheme.jsx';
import AppErrorBoundary from './components/feedback/AppErrorBoundary.jsx';
import AppToastContainer from './components/feedback/AppToastContainer.jsx';
import { fetchCurrentUser } from './store/authSlice.js';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <AppTheme>
      <CssBaseline />
      <AppErrorBoundary>
        <AppToastContainer />
        <Outlet />
      </AppErrorBoundary>
    </AppTheme>
  );
}

export default App;
