/**
 * Reusable MUI TextField wrapper.
 *
 * Defaults to size="small". Supports startAdornment/endAdornment
 * via slotProps={{ input: { startAdornment: ..., endAdornment: ... } }}.
 * Wrapped with forwardRef for react-hook-form compatibility.
 * No debounce — direct input immediately.
 *
 * @module components/reusable/MuiTextField
 */
import { forwardRef } from 'react';
import TextField from '@mui/material/TextField';

/**
 * @param {object} props - MUI TextField props, plus optional slotProps.input.startAdornment/endAdornment
 * @param {React.Ref} ref
 * @returns {JSX.Element}
 */
const MuiTextField = forwardRef(({ size = 'small', ...rest }, ref) => {
  return <TextField size={size} {...rest} ref={ref} />;
});

MuiTextField.displayName = 'MuiTextField';

export default MuiTextField;
