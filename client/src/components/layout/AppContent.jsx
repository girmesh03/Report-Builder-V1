/**
 * Protected scrollable content area.
 *
 * Renders child routes inside a scrollable container below the
 * AppTopbar and beside the AppSidebar.
 *
 * @module components/layout/AppContent
 */
import { Outlet } from 'react-router';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

/**
 * @returns {JSX.Element}
 */
function AppContent() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Toolbar />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppContent;
