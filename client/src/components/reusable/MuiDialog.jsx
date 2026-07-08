/**
 * Reusable MUI Dialog wrapper.
 *
 * Defaults disableEnforceFocus and disableRestoreFocus to true
 * to prevent focus-management issues in modal dialogs.
 * Wrapped with forwardRef for react-hook-form compatibility.
 *
 * @module components/reusable/MuiDialog
 */
import { forwardRef } from 'react';
import Dialog from '@mui/material/Dialog';

/**
 * @param {object} props - MUI Dialog props
 * @param {boolean} [props.disableEnforceFocus=true]
 * @param {boolean} [props.disableRestoreFocus=true]
 * @param {React.Ref} ref
 * @returns {JSX.Element}
 */
const MuiDialog = forwardRef(({ disableEnforceFocus = true, disableRestoreFocus = true, ...rest }, ref) => {
  return (
    <Dialog
      disableEnforceFocus={disableEnforceFocus}
      disableRestoreFocus={disableRestoreFocus}
      {...rest}
      ref={ref}
    />
  );
});

MuiDialog.displayName = 'MuiDialog';

export default MuiDialog;
