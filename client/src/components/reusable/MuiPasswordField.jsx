/**
 * Reusable MUI Password Field wrapper.
 *
 * Provides show/hide password toggle via endAdornment with no layout shift.
 * Wrapped with forwardRef for react-hook-form compatibility.
 * Defaults to size="small".
 *
 * @module components/reusable/MuiPasswordField
 */
import { forwardRef, useState, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

/**
 * @param {object} props - MUI TextField props, plus optional slotProps.input.startAdornment
 * @param {React.Ref} ref
 * @returns {JSX.Element}
 */
const MuiPasswordField = forwardRef(({ size = 'small', slotProps, ...rest }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShow = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <TextField
      size={size}
      type={showPassword ? 'text' : 'password'}
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                onClick={toggleShow}
                onMouseDown={(e) => e.preventDefault()}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                edge="end"
                size="small"
              >
                {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...rest}
      ref={ref}
    />
  );
});

MuiPasswordField.displayName = 'MuiPasswordField';

export default MuiPasswordField;
