/**
 * Protected top bar.
 *
 * Sticky within the flex layout so it does NOT overlay the sidebar
 * on desktop. On mobile the temporary drawer slides above it.
 *
 * @module components/layout/AppTopbar
 */
import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useColorScheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { logout } from "../../store/authSlice.js";
import { ROUTE_PATHS } from "../../utils/routePaths.js";
import GlobalSearchDialog from "./GlobalSearchDialog.jsx";

const PAGE_TITLES = {
  [ROUTE_PATHS.DASHBOARD]: "Dashboard",
  [ROUTE_PATHS.REPORTS]: "Reports",
  [ROUTE_PATHS.PROFILE]: "Profile",
};

/**
 * @param {object} props
 * @param {() => void} props.onMenuToggle
 * @returns {JSX.Element}
 */
function AppTopbar({ onMenuToggle }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const { mode, setMode } = useColorScheme();

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

  const handleThemeToggle = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          zIndex: (theme) => theme.zIndex.appBar,
          backgroundImage: "none",
          backgroundColor: "background.paper",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuToggle}
            sx={{ mr: 1, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {PAGE_TITLES[location.pathname] || "Report Builder"}
          </Typography>
          <Tooltip title="Search">
            <IconButton onClick={() => setSearchOpen(true)} size="small" sx={{ ml: 1 }}>
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={handleThemeToggle} size="small" sx={{ ml: 0.5 }}>
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Account settings">
            <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 0.5 }}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            slotProps={{ paper: { sx: { minWidth: 180 } } }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <GlobalSearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default AppTopbar;
