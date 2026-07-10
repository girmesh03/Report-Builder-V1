/**
 * Reusable MUI Select wrapper.
 *
 * Defaults to size="small". Limits dropdown menu height to 300px
 * via MenuProps.slotProps.paper.sx.maxHeight.
 * Wrapped with forwardRef for react-hook-form compatibility.
 *
 * @module components/reusable/MuiSelect
 */
import { forwardRef } from 'react';
import Select from '@mui/material/Select';

/**
 * @param {object} props - MUI Select props
 * @param {React.Ref} ref
 * @returns {JSX.Element}
 */
const MuiSelect = forwardRef(({ size = 'small', MenuProps, ...rest }, ref) => {
  return (
    <Select
      size={size}
      MenuProps={{
        slotProps: { paper: { sx: { maxHeight: 300 } } },
        ...MenuProps,
      }}
      {...rest}
      ref={ref}
    />
  );
});

MuiSelect.displayName = 'MuiSelect';

export default MuiSelect;
