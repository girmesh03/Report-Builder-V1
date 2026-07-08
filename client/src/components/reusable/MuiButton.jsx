/**
 * Reusable MUI Button wrapper.
 *
 * Wrapped with forwardRef for react-hook-form compatibility.
 *
 * @module components/reusable/MuiButton
 */
import { forwardRef } from 'react';
import Button from '@mui/material/Button';

/**
 * @param {object} props - MUI Button props
 * @param {React.Ref} ref
 * @returns {JSX.Element}
 */
const MuiButton = forwardRef((props, ref) => {
  return <Button {...props} ref={ref} />;
});

MuiButton.displayName = 'MuiButton';

export default MuiButton;
