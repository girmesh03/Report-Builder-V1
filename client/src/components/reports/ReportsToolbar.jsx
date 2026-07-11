/**
 * Reports toolbar.
 *
 * Responsive toolbar: filter icon with badge, create button
 * (icon-only on xs), list/grid toggle. Search moved to
 * GlobalSearchDialog.
 *
 * @module components/reports/ReportsToolbar
 */
import { useCallback } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MuiButton from "../reusable/MuiButton.jsx";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import MuiPageHeader from "../reusable/MuiPageHeader.jsx";

/**
 * @param {object} props
 * @param {'list'|'grid'} props.viewMode
 * @param {function} onViewModeChange
 * @param {function} onFilterClick
 * @param {number} props.activeFilterCount
 * @param {function} onCreateClick
 * @returns {JSX.Element}
 */
function ReportsToolbar({
  viewMode,
  onViewModeChange,
  onFilterClick,
  activeFilterCount = 0,
  onCreateClick,
}) {
  const handleViewModeChange = useCallback(
    (_e, newMode) => {
      if (newMode) {
        onViewModeChange(newMode);
      }
    },
    [onViewModeChange],
  );

  return (
    <MuiPageHeader
      title="Reports"
      subtitle="Manage your branch visit reports"
      action={
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Tooltip title="Filter">
            <span>
              <IconButton size="small" onClick={onFilterClick}>
                <Badge
                  badgeContent={activeFilterCount}
                  color="primary"
                  size="small"
                >
                  <FilterListIcon />
                </Badge>
              </IconButton>
            </span>
          </Tooltip>
          <MuiButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateClick}
            size="small"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
            }}
          >
            Create Report
          </MuiButton>
          <IconButton
            size="small"
            color="primary"
            onClick={onCreateClick}
            sx={{
              display: { xs: "inline-flex", sm: "none" },
            }}
          >
            <AddIcon />
          </IconButton>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
          >
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="grid" aria-label="grid view">
              <GridViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      }
    />
  );
}

export default ReportsToolbar;
