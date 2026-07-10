/**
 * Public page AppBar.
 *
 * Left side: logo icon + application name (clickable to navigate home).
 * Right side: theme toggle (light/dark mode).
 *
 * @module components/layout/PublicAppBar
 */
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DescriptionIcon from "@mui/icons-material/Description";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useColorScheme } from "@mui/material/styles";

/**
 * @returns {JSX.Element}
 */
function PublicAppBar() {
  const navigate = useNavigate();
  const { mode, setMode } = useColorScheme();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  const handleLogoClick = () => {
    navigate(isAuthenticated ? "/dashboard" : "/");
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <Toolbar>
        <Box
          onClick={handleLogoClick}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexGrow: 1,
            cursor: "pointer",
          }}
        >
          <DescriptionIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ letterSpacing: -0.5 }}
          >
            Report Builder
          </Typography>
        </Box>
        <IconButton
          onClick={toggleTheme}
          color="inherit"
          aria-label="Toggle theme"
        >
          {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default PublicAppBar;
