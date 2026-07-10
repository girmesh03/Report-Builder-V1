/**
 * Reusable MUI Button wrapper.
 *
 * Wrapped with forwardRef for react-hook-form compatibility.
 * Use MUI's native `loading`, `loadingIndicator`, and
 * `loadingPosition` props on the consuming side.
 *
 * @module components/reusable/MuiButton
 */
import { forwardRef } from "react";
import Button from "@mui/material/Button";

/**
 * @param {object} props - MUI Button props
 * @param {React.Ref} ref
 * @returns {JSX.Element}
 */
const MuiButton = forwardRef(({ size = "small", ...props }, ref) => {
  return <Button size={size} {...props} ref={ref} />;
});

MuiButton.displayName = "MuiButton";

export default MuiButton;
