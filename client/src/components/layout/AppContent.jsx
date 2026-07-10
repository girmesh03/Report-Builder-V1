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

/**
 * @returns {JSX.Element}
 */
function AppContent() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
      }}
    >
      <Outlet />
    </Box>
  );
}

export default AppContent;
