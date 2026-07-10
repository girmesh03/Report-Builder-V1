/**
 * Reusable MUI DatePicker wrapper.
 *
 * Switches between DesktopDatePicker (popper) on md+ screens
 * and MobileDatePicker (dialog) on smaller screens to avoid
 * nested-dialog issues and provide native mobile UX.
 *
 * @module components/reusable/MuiDatePicker
 */
import { forwardRef } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

/**
 * @param {object} props - MUI DatePicker props
 * @param {React.Ref} ref
 * @returns {JSX.Element}
 */
const MuiDatePicker = forwardRef((props, ref) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  if (isDesktop) {
    return <DesktopDatePicker {...props} ref={ref} />;
  }

  return <MobileDatePicker {...props} ref={ref} />;
});

MuiDatePicker.displayName = "MuiDatePicker";

export default MuiDatePicker;
