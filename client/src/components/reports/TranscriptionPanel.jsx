/**
 * Transcription panel component.
 *
 * Displays transcription controls and results after audio upload.
 * Shows loading state during transcription, raw text when complete,
 * and a Re-transcribe button for testing accuracy.
 *
 * @module components/reports/TranscriptionPanel
 */
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import TranscribeIcon from '@mui/icons-material/Transcribe';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import MuiButton from '../reusable/MuiButton.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import { requestTranscription } from '../../services/transcriptionApi.js';

/**
 * @param {object} props
 * @param {string} props.reportId - Report ID
 * @param {function} props.onTranscriptionComplete - Called with transcription data
 * @returns {JSX.Element}
 */
function TranscriptionPanel({ reportId, onTranscriptionComplete }) {
  const [transcribing, setTranscribing] = useState(false);
  const [transcription, setTranscription] = useState(null);
  const [error, setError] = useState(null);

  const handleTranscribe = async () => {
    setTranscribing(true);
    setError(null);
    try {
      const res = await requestTranscription(reportId);
      const data = res?.data;
      setTranscription(data?.transcription || null);
      if (onTranscriptionComplete) {
        onTranscriptionComplete(data?.transcription || null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setTranscribing(false);
    }
  };

  if (transcribing) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2} sx={{ alignItems: 'center', py: 3 }}>
            <CircularProgress size={40} />
            <Typography variant="body1" color="text.secondary">
              Transcribing audio with Addis AI...
            </Typography>
            <LinearProgress sx={{ width: '100%' }} />
            <Typography variant="caption" color="text.secondary">
              This may take a moment. Please do not close this page.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Alert severity="error">{error}</Alert>
            <MuiButton
              variant="outlined"
              onClick={handleTranscribe}
              startIcon={<TranscribeIcon />}
            >
              Retry Transcription
            </MuiButton>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (transcription) {
    const confidencePct = transcription.confidence
      ? `${(transcription.confidence * 100).toFixed(1)}%`
      : null;

    return (
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <CheckCircleOutlinedIcon color="success" />
              <Typography variant="subtitle1" fontWeight={600}>
                Transcription Complete
              </Typography>
            </Stack>

            {transcription.text && (
              <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                >
                  {transcription.text}
                </Typography>
              </Card>
            )}

            <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
              {confidencePct && (
                <Typography variant="caption" color="text.secondary">
                  Confidence: <strong>{confidencePct}</strong>
                </Typography>
              )}
              {transcription.billedDuration > 0 && (
                <Typography variant="caption" color="text.secondary">
                  Duration: <strong>{transcription.billedDuration}s</strong>
                </Typography>
              )}
              {transcription.languageCode && (
                <Typography variant="caption" color="text.secondary">
                  Language: <strong>{transcription.languageCode}</strong>
                </Typography>
              )}
            </Stack>

            <MuiButton
              variant="outlined"
              onClick={handleTranscribe}
              startIcon={<ReplayIcon />}
              size="small"
            >
              Re-transcribe
            </MuiButton>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight={600}>
            Transcription
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Send the recorded audio to Addis AI for Amharic speech-to-text transcription.
          </Typography>
          <MuiButton
            variant="contained"
            onClick={handleTranscribe}
            startIcon={<TranscribeIcon />}
          >
            Request Transcription
          </MuiButton>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default TranscriptionPanel;
