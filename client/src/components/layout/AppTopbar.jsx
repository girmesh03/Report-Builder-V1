/**
 * Protected top bar.
 *
 * Shows a hamburger menu (mobile), the current page title,
 * and a user avatar dropdown with profile link and logout.
 *
 * @module components/layout/AppTopbar
 */
import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../../store/authSlice.js';
import { ROUTE_PATHS } from '../../utils/routePaths.js';

const PAGE_TITLES = {
  [ROUTE_PATHS.DASHBOARD]: 'Dashboard',
  [ROUTE_PATHS.REPORTS]: 'Reports',
  [ROUTE_PATHS.PROFILE]: 'Profile',
};

/**
 * @param {object} props
 * @param {() => void} props.onMenuToggle - Callback to toggle mobile sidebar
 * @returns {JSX.Element}
 */
function AppTopbar({ onMenuToggle }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleProfile = useCallback(() => {
    setAnchorEl(null);
    navigate(ROUTE_PATHS.PROFILE);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    setAnchorEl(null);
    dispatch(logout());
    navigate(ROUTE_PATHS.LOGIN);
  }, [dispatch, navigate]);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          {PAGE_TITLES[location.pathname] || 'Report Builder'}
        </Typography>
        <Tooltip title="Account settings">
          <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2 }}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          slotProps={{ paper: { sx: { minWidth: 180 } } }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfile}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default AppTopbar;
