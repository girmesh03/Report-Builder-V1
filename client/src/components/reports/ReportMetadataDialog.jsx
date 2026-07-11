/**
 * Report metadata dialog.
 *
 * Dialog form for creating/editing a draft report with date, branches, and notes.
 * Uses react-hook-form with register for notes field.
 * Branch multi-select uses MuiTextField select with Controller
 * (Controller required because MUI Select does not accept register ref).
 *
 * @module components/reports/ReportMetadataDialog
 */
import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import MuiDialog from '../reusable/MuiDialog.jsx';
import MuiButton from '../reusable/MuiButton.jsx';
import MuiTextField from '../reusable/MuiTextField.jsx';
import MuiDatePicker from '../reusable/MuiDatePicker.jsx';
import dayjs from 'dayjs';

function getBranchIds(report) {
  if (!report || !report.branches) return [];
  return report.branches.map((b) => (typeof b === 'string' ? b : b._id));
}

/**
 * @param {object} props
 * @param {boolean} open
 * @param {function} onClose
 * @param {function} onSubmit
 * @param {Array<object>} branches
 * @param {boolean} isLoading
 * @param {object|null} initialData
 * @returns {JSX.Element}
 */
function ReportMetadataDialog({ open, onClose, onSubmit, branches, isLoading, initialData = null }) {
  const isEditing = Boolean(initialData);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: {
      reportDate: dayjs(),
      branches: [],
      notes: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          reportDate: initialData.reportDate ? dayjs(initialData.reportDate) : dayjs(),
          branches: getBranchIds(initialData),
          notes: initialData.notes || '',
        });
      } else {
        reset({
          reportDate: dayjs(),
          branches: [],
          notes: '',
        });
      }
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = handleSubmit((data) => {
    const payload = {
      reportDate: data.reportDate.toISOString(),
      branches: data.branches || [],
      notes: data.notes || undefined,
    };
    onSubmit(payload);
  });

  return (
    <MuiDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleFormSubmit}>
        <DialogTitle>{isEditing ? 'Edit Report' : 'Create New Report'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="reportDate"
                control={control}
                rules={{ required: 'Date is required' }}
                render={({ field }) => (
                  <MuiDatePicker
                    label="Report Date"
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        error: !!errors.reportDate,
                        helperText: errors.reportDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="branches"
                control={control}
                render={({ field }) => (
                  <MuiTextField
                    select
                    fullWidth
                    label="Branches"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    slotProps={{
                      select: {
                        multiple: true,
                        MenuProps: {
                          slotProps: { paper: { sx: { maxHeight: 300 } } },
                        },
                      },
                    }}
                  >
                    {(!branches || branches.length === 0) ? (
                      <MenuItem disabled value="">
                        No branches available
                      </MenuItem>
                    ) : (branches || []).map((branch) => (
                      <MenuItem key={branch._id} value={branch._id}>
                        {branch.name}
                      </MenuItem>
                    ))}
                  </MuiTextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <MuiTextField
                label="Notes (optional)"
                fullWidth
                multiline
                rows={3}
                {...register('notes')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={onClose} disabled={isLoading} size="small">Cancel</MuiButton>
          <MuiButton
            type="submit"
            variant="contained"
            disabled={isLoading}
            size="small"
            loading={isLoading}
            loadingIndicator={<CircularProgress size={20} />}
            loadingPosition="center"
          >
            {isEditing ? 'Save' : 'Create'}
          </MuiButton>
        </DialogActions>
      </form>
    </MuiDialog>
  );
}

export default ReportMetadataDialog;
