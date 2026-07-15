/**
 * Audio recorder component.
 *
 * Manages multiple audio clips per session. Shows list of recorded clips
 * with play/pause, discard for each. Provides "Record New" button when
 * not currently recording. Submit sends all clips to the parent.
 *
 * @module components/audio/AudioRecorder
 */
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import useAudioRecorder from '../../hooks/useAudioRecorder.js';
import AudioRecordingControls from './AudioRecordingControls.jsx';
import AudioRecordingMeter from './AudioRecordingMeter.jsx';
import MuiButton from '../reusable/MuiButton.jsx';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { isSilentRecording } from '../../utils/audioUtils.js';

/**
 * @param {object} props
 * @param {(clips: Array<{ id: number|string, blob: Blob, duration: number, mimeType: string }>) => void} [props.onSubmit] - Called with all clips
 * @param {boolean} [props.disabled] - Disables submit button during upload
 * @returns {JSX.Element}
 */
function AudioRecorder({ onSubmit, disabled }) {
  const {
    recordings,
    duration,
    error,
    mimeType,
    isRecording,
    isIdle,
    mediaStream,
    startRecording,
    stopRecording,
    discardRecording,
    resetRecordings,
  } = useAudioRecorder();

  const hasRecordings = recordings.length > 0;
  const allValid = recordings.every(
    (r) => r.blob && r.blob.size > 0 && !isSilentRecording(r.blob.size)
  );

  const handleSubmit = () => {
    if (onSubmit && hasRecordings && allValid && !disabled) {
      const clips = recordings.map((r) => ({
        id: r.id,
        blob: r.blob,
        duration: r.duration,
        mimeType: r.mimeType,
      }));
      onSubmit(clips, resetRecordings);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isRecording && <AudioRecordingMeter duration={duration} stream={mediaStream} />}

      <AudioRecordingControls
        isIdle={isIdle && (!isRecording)}
        isRecording={isRecording}
        onStart={startRecording}
        onStop={stopRecording}
        recordings={recordings}
        onDiscard={discardRecording}
      />

      {!isRecording && hasRecordings && (
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
          <MuiButton
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={startRecording}
            aria-label="Record another clip"
          >
            Record New
          </MuiButton>
          <MuiButton
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={handleSubmit}
            disabled={!allValid || disabled}
            aria-label="Submit all recordings"
          >
            Submit {recordings.length > 1 ? `${recordings.length} Clips` : 'Clip'}
          </MuiButton>
        </Stack>
      )}
    </Box>
  );
}

export default AudioRecorder;
