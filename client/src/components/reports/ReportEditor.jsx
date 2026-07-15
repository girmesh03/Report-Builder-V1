/**
 * Report editor component.
 *
 * Provides a multiline text field for editing the generated report.
 * Uses react-hook-form `register` for uncontrolled input to avoid
 * re-renders on every keystroke. Submits content on save action.
 *
 * @module components/reports/ReportEditor
 */
import { useForm } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import MuiTextField from '../reusable/MuiTextField.jsx';
import MuiButton from '../reusable/MuiButton.jsx';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * @param {object} props
 * @param {string} props.initialText - Current report text to edit
 * @param {boolean} [props.saving] - Whether a save is in progress
 * @param {(editedReport: string) => void} props.onSave - Called with the edited text on save
 */
function ReportEditor({ initialText, saving, onSave }) {
  const { register, handleSubmit } = useForm({
    defaultValues: { editedReport: initialText },
  });

  const onSubmit = (data) => {
    onSave(data.editedReport);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <MuiTextField
          {...register('editedReport')}
          multiline
          minRows={12}
          maxRows={30}
          fullWidth
          slotProps={{
            input: {
              sx: {
                fontFamily: '"Noto Sans Ethiopic", "Inter", sans-serif',
                lineHeight: 1.7,
                fontSize: '0.95rem',
              },
            },
          }}
        />
        <MuiButton
          type="submit"
          variant="contained"
          disabled={saving}
          loading={saving}
          loadingIndicator={<CircularProgress size={20} />}
          loadingPosition="center"
        >
          Save Edits
        </MuiButton>
      </Stack>
    </form>
  );
}

export default ReportEditor;
