/**
 * Reusable MUI DataGrid wrapper.
 *
 * Defaults disableColumnMenu to true for a cleaner grid.
 * Wrapped with forwardRef.
 *
 * @module components/reusable/MuiDataGrid
 */
import { forwardRef } from 'react';
import { DataGrid } from '@mui/x-data-grid/DataGrid';

/**
 * @param {object} props - MUI DataGrid props
 * @param {boolean} [props.disableColumnMenu=true]
 * @param {React.Ref} ref
 * @returns {JSX.Element}
 */
const MuiDataGrid = forwardRef(({ disableColumnMenu = true, ...rest }, ref) => {
  return <DataGrid disableColumnMenu={disableColumnMenu} {...rest} ref={ref} />;
});

MuiDataGrid.displayName = 'MuiDataGrid';

export default MuiDataGrid;
