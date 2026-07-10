/**
 * Reports filter dialog.
 *
 * Dialog with status, branch, dateFrom, dateTo fields in a Grid layout.
 * Each field has a clear icon adornment. Apply and Clear buttons.
 * Clear resets fields to defaults, applies empty filters, and closes.
 *
 * @module components/reports/ReportsFilterDialog
 */
import { useState, useCallback, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";
import MuiDialog from "../reusable/MuiDialog.jsx";
import MuiButton from "../reusable/MuiButton.jsx";
import MuiTextField from "../reusable/MuiTextField.jsx";
import MuiDatePicker from "../reusable/MuiDatePicker.jsx";
import dayjs from "dayjs";

const REPORT_STATUSES = [
  "draft",
  "audio_recorded",
  "transcribed",
  "transcription_reviewed",
  "generated",
  "finalized",
  "exported",
];

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {function} props.onClose
 * @param {function} props.onApply
 * @param {object} props.initialFilters
 * @param {Array<object>} props.branches
 * @returns {JSX.Element}
 */
function ReportsFilterDialog({
  open,
  onClose,
  onApply,
  initialFilters = {},
  branches = [],
}) {
  const [status, setStatus] = useState(initialFilters.status || "");
  const [branch, setBranch] = useState(initialFilters.branch || "");
  const [dateFrom, setDateFrom] = useState(
    initialFilters.dateFrom ? dayjs(initialFilters.dateFrom) : null,
  );
  const [dateTo, setDateTo] = useState(
    initialFilters.dateTo ? dayjs(initialFilters.dateTo) : null,
  );

  const resetFromInitial = useCallback(() => {
    setStatus(initialFilters.status || "");
    setBranch(initialFilters.branch || "");
    setDateFrom(
      initialFilters.dateFrom ? dayjs(initialFilters.dateFrom) : null,
    );
    setDateTo(initialFilters.dateTo ? dayjs(initialFilters.dateTo) : null);
  }, [initialFilters]);

  useEffect(() => {
    if (open) {
      resetFromInitial();
    }
  }, [open, resetFromInitial]);

  const handleApply = useCallback(() => {
    const filters = {};
    if (status) filters.status = status;
    if (branch) filters.branch = branch;
    if (dateFrom) filters.dateFrom = dateFrom.format("YYYY-MM-DD");
    if (dateTo) filters.dateTo = dateTo.format("YYYY-MM-DD");
    onApply(filters);
    onClose();
  }, [status, branch, dateFrom, dateTo, onApply, onClose]);

  const handleClear = useCallback(() => {
    setStatus("");
    setBranch("");
    setDateFrom(null);
    setDateTo(null);
    onApply({ status: "", branch: "", dateFrom: "", dateTo: "" });
    onClose();
  }, [onApply, onClose]);

  return (
    <MuiDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter Reports</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MuiTextField
              select
              fullWidth
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              slotProps={{
                input: status
                  ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setStatus("")}
                            edge="end"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  : undefined,
                select: {
                  MenuProps: {
                    slotProps: { paper: { sx: { maxHeight: 300 } } },
                  },
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {REPORT_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </MenuItem>
              ))}
            </MuiTextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MuiTextField
              select
              fullWidth
              label="Branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              slotProps={{
                input: branch
                  ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setBranch("")}
                            edge="end"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  : undefined,
                select: {
                  MenuProps: {
                    slotProps: { paper: { sx: { maxHeight: 300 } } },
                  },
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {branches.map((b) => (
                <MenuItem key={b._id} value={b._id}>
                  {b.name}
                </MenuItem>
              ))}
            </MuiTextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MuiDatePicker
              label="From"
              value={dateFrom}
              onChange={(newValue) => setDateFrom(newValue)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  slotProps: dateFrom
                    ? {
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => setDateFrom(null)}
                                edge="end"
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }
                    : undefined,
                },
              }}
              sx={{
                "&.MuiDialog-paper": { margin: 0 },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MuiDatePicker
              label="To"
              value={dateTo}
              onChange={(newValue) => setDateTo(newValue)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  slotProps: dateTo
                    ? {
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => setDateTo(null)}
                                edge="end"
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }
                    : undefined,
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={handleClear} color="inherit" size="small">
          Clear
        </MuiButton>
        <MuiButton onClick={handleApply} variant="contained" size="small">
          Apply
        </MuiButton>
      </DialogActions>
    </MuiDialog>
  );
}

export default ReportsFilterDialog;
