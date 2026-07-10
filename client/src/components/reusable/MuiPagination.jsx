/**
 * Reusable MUI Pagination wrapper.
 *
 * Wraps MUI Pagination with forwardRef and sensible defaults.
 * Color defaults to "primary", shape defaults to "rounded".
 *
 * @module components/reusable/MuiPagination
 */
import { forwardRef } from 'react';
import Pagination from '@mui/material/Pagination';

/**
 * @param {object} props - MUI Pagination props
 * @param {React.Ref} ref
 * @returns {JSX.Element}
 */
const MuiPagination = forwardRef(({ color = 'primary', shape = 'rounded', ...rest }, ref) => {
  return <Pagination color={color} shape={shape} {...rest} ref={ref} />;
});

MuiPagination.displayName = 'MuiPagination';

export default MuiPagination;
