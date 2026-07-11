/**
 * Audio recording controls.
 *
 * Provides start and stop recording buttons with icons.
 * Discard/re-record/submit buttons appear in AudioPlayback.
 *
 * @module components/audio/AudioRecordingControls
 */
import Stack from '@mui/material/Stack';
import MuiButton from '../reusable/MuiButton.jsx';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

/**
 * @param {object} props
 * @param {boolean} props.isIdle - Whether recording has not started
 * @param {boolean} props.isRecording - Whether recording is in progress
 * @param {() => void} props.onStart - Start recording handler
 * @param {() => void} props.onStop - Stop recording handler
 * @returns {JSX.Element}
 */
function AudioRecordingControls({
  isIdle,
  isRecording,
  onStart,
  onStop,
}) {
  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
      {isIdle && (
        <MuiButton
          variant="contained"
          color="error"
          startIcon={<MicIcon />}
          onClick={onStart}
          aria-label="Start recording"
        >
          Start Recording
        </MuiButton>
      )}
      {isRecording && (
        <MuiButton
          variant="contained"
          color="error"
          startIcon={<StopIcon />}
          onClick={onStop}
          aria-label="Stop recording"
        >
          Stop Recording
        </MuiButton>
      )}
    </Stack>
  );
}

export default AudioRecordingControls;
