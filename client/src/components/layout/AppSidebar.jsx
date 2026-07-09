/**
 * Protected sidebar navigation.
 *
 * Responsive: permanent Drawer on md+ viewports, temporary
 * Drawer (toggleable) on smaller screens.
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
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { ROUTE_PATHS } from "../../utils/routePaths.js";

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: "Dashboard", path: ROUTE_PATHS.DASHBOARD, icon: <DashboardIcon /> },
  { label: "Reports", path: ROUTE_PATHS.REPORTS, icon: <DescriptionIcon /> },
  { label: "Profile", path: ROUTE_PATHS.PROFILE, icon: <PersonIcon /> },
];

/**
 * @param {object} props
 * @param {boolean} props.open - Whether the mobile drawer is open
 * @param {() => void} props.onClose - Callback to close the mobile drawer
 * @param {() => void} props.onLogout - Callback for logout action
 * @returns {JSX.Element}
 */
function AppSidebar({ open, onClose, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
        <List>
          {NAV_ITEMS.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Box>
          <Divider />
          <List>
            <ListItemButton onClick={onLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
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
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default AppSidebar;
