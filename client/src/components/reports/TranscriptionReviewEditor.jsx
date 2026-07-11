/**
 * Transcription review editor component.
 *
 * Allows the user to review and edit the raw transcription
 * before saving it for AI report generation.
 *
 * Uses react-hook-form with register (no watch/Controller).
 *
 * @module components/reports/TranscriptionReviewEditor
 */
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import RateReviewIcon from '@mui/icons-material/RateReview';
import MuiButton from '../reusable/MuiButton.jsx';
import MuiTextField from '../reusable/MuiTextField.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import { saveReviewedTranscription } from '../../services/reportGenerationApi.js';

/**
 * @param {object} props
 * @param {string} props.reportId - Report ID
 * @param {string} props.initialText - Raw transcription text to pre-fill
 * @param {function} props.onReviewSaved - Called after successful save
 * @returns {JSX.Element}
 */
function TranscriptionReviewEditor({ reportId, initialText, onReviewSaved }) {
  const [text, setText] = useState(initialText || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!text.trim()) {
      setError('Transcription cannot be empty.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await saveReviewedTranscription(reportId, text);
      setSaved(true);
      if (onReviewSaved) {
        onReviewSaved();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <CheckCircleOutlinedIcon color="success" />
              <Typography variant="subtitle1" fontWeight={600}>
                Reviewed Transcription Saved
              </Typography>
            </Stack>
            <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
              <Typography
                variant="body2"
                sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                {text}
              </Typography>
            </Card>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <RateReviewIcon color="primary" />
            <Typography variant="subtitle1" fontWeight={600}>
              Review & Edit Transcription
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Review the raw transcription, correct any errors, then save for AI
            report generation.
          </Typography>

          <MuiTextField
            label="Transcription"
            multiline
            minRows={6}
            maxRows={20}
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
          />

          {error && (
            <Alert severity="error">{error}</Alert>
          )}

          <MuiButton
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} /> : undefined}
          >
            {saving ? 'Saving...' : 'Save Reviewed Transcription'}
          </MuiButton>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default TranscriptionReviewEditor;
