/**
 * Protected sidebar navigation.
 *
 * Responsive: permanent Drawer on md+ (collapsible via menu icon),
 * temporary Drawer on smaller screens. App name at top,
 * clickable to /dashboard. Logout at bottom with Divider.
 *
 * @module components/layout/AppSidebar
 */
import { useLocation, useNavigate } from "react-router";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { ROUTE_PATHS } from "../../utils/routePaths.js";

const DRAWER_WIDTH = 240;
const DRAWER_COLLAPSED_WIDTH = 64;

const NAV_ITEMS = [
  { label: "Dashboard", path: ROUTE_PATHS.DASHBOARD, icon: <DashboardIcon /> },
  { label: "Reports", path: ROUTE_PATHS.REPORTS, icon: <DescriptionIcon /> },
  { label: "Profile", path: ROUTE_PATHS.PROFILE, icon: <PersonIcon /> },
];

/**
 * Shared nav + logout list for both drawer variants.
 * @param {object} opts
 * @param {boolean} opts.collapsed
 * @param {function} opts.onItemClick
 * @param {function} opts.onLogout
 * @param {object} opts.location
 * @param {function} opts.navigate
 * @returns {JSX.Element}
 */
function SidebarNav({ collapsed, onItemClick, onLogout, location, navigate }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "space-between",
      }}
    >
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => { navigate(item.path); onItemClick?.(); }}
            sx={{ justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 0 : 2 }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
              {item.icon}
            </ListItemIcon>
            {!collapsed && <ListItemText primary={item.label} />}
          </ListItemButton>
        ))}
      </List>
      <Box>
        <Divider />
        <List>
          <ListItemButton
            onClick={onLogout}
            sx={{ justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 0 : 2 }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Logout" />}
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
}

/**
 * @param {object} props
 * @param {boolean} props.open - Mobile drawer open state
 * @param {() => void} props.onClose - Close mobile drawer
 * @param {() => void} props.onLogout - Logout callback
 * @param {boolean} props.collapsed - Whether permanent sidebar is collapsed
 * @param {() => void} props.onToggleCollapse - Toggle collapsed state
 * @returns {JSX.Element}
 */
function AppSidebar({ open, onClose, onLogout, collapsed, onToggleCollapse }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* Permanent drawer (md+) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH,
            boxSizing: "border-box",
            overflowX: 'hidden',
            transition: 'width 200ms ease',
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? 'center' : 'flex-start',
            px: collapsed ? 0 : 1,
            minHeight: 64,
          }}
        >
          <IconButton onClick={onToggleCollapse} size="small">
            <MenuIcon />
          </IconButton>
          {!collapsed && (
            <Typography
              variant="subtitle1"
              noWrap
              sx={{ cursor: 'pointer', fontWeight: 700, ml: 1, letterSpacing: 0.5, fontSize: '1rem' }}
              onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}
            >
              Report Builder
            </Typography>
          )}
        </Box>
        <SidebarNav
          collapsed={collapsed}
          location={location}
          navigate={navigate}
          onLogout={onLogout}
        />
      </Drawer>

      {/* Temporary drawer (mobile) */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        disableEnforceFocus
        disableRestoreFocus
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundImage: "none",
            backgroundColor: "background.paper",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: 'center',
            px: 2,
            minHeight: 64,
          }}
        >
          <Typography
            variant="subtitle1"
            noWrap
            sx={{
              cursor: 'pointer',
              fontWeight: 700,
              letterSpacing: 0.5,
              fontSize: '1rem',
              textAlign: 'center',
            }}
            onClick={() => { navigate(ROUTE_PATHS.DASHBOARD); onClose(); }}
          >
            Report Builder
          </Typography>
        </Box>
        <SidebarNav
          collapsed={false}
          location={location}
          navigate={navigate}
          onItemClick={onClose}
          onLogout={onLogout}
        />
      </Drawer>
    </>
  );
}

export default AppSidebar;
