/**
 * Public layout wrapper.
 *
 * Renders the PublicAppBar at top and the child route content below.
 * Used for landing, login, register, and OAuth callback pages.
 *
 * @module components/layout/PublicLayout
 */
import Box from '@mui/material/Box';
import { Outlet } from 'react-router';
import PublicAppBar from './PublicAppBar.jsx';

/**
 * @returns {JSX.Element}
 */
function PublicLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <PublicAppBar />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default PublicLayout;
