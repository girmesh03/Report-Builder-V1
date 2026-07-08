/**
 * Reusable MUI DatePicker wrapper.
 *
 * Wraps @mui/x-date-pickers/DatePicker with forwardRef for
 * react-hook-form compatibility. Assumes a
 * LocalizationProvider is mounted higher in the tree.
 *
 * @module components/reusable/MuiDatePicker
 */
import { forwardRef } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

/**
 * @param {object} props - MUI DatePicker props
 * @param {React.Ref} ref
 * @returns {JSX.Element}
 */
const MuiDatePicker = forwardRef((props, ref) => {
  return <DatePicker {...props} ref={ref} />;
});

MuiDatePicker.displayName = 'MuiDatePicker';

export default MuiDatePicker;
