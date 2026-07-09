/**
 * Protected application shell.
 *
 * Wraps the AppSidebar, AppTopbar, and scrollable content area.
 * Manages mobile sidebar open/close state.
 *
 * @module components/layout/AppShell
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import AppSidebar from './AppSidebar.jsx';
import AppTopbar from './AppTopbar.jsx';
import AppContent from './AppContent.jsx';
import { logout } from '../../store/authSlice.js';
import { ROUTE_PATHS } from '../../utils/routePaths.js';

/**
 * @returns {JSX.Element}
 */
function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMenuToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate(ROUTE_PATHS.LOGIN);
  }, [dispatch, navigate]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AppTopbar onMenuToggle={handleMenuToggle} />
      <AppSidebar open={mobileOpen} onClose={handleSidebarClose} onLogout={handleLogout} />
      <AppContent />
    </Box>
  );
}

export default AppShell;
