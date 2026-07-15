/**
 * Audio recording controls.
 *
 * Provides start and stop recording buttons with icons.
 * Shows list of completed recordings with individual playback controls.
 *
 * @module components/audio/AudioRecordingControls
 */
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MuiButton from '../reusable/MuiButton.jsx';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import AudioPlayback from './AudioPlayback.jsx';

/**
 * @param {object} props
 * @param {boolean} props.isIdle - Whether no recording is in progress
 * @param {boolean} props.isRecording - Whether recording is in progress
 * @param {() => void} props.onStart - Start recording handler
 * @param {() => void} props.onStop - Stop recording handler
 * @param {Array<{ id: number|string, url: string, duration: number }>} props.recordings - Completed recordings
 * @param {(id: number|string) => void} props.onDiscard - Discard a recording handler
 * @returns {JSX.Element}
 */
function AudioRecordingControls({
  isIdle,
  isRecording,
  onStart,
  onStop,
  recordings,
  onDiscard,
}) {
  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mb: recordings.length > 0 ? 2 : 0 }}>
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

      {recordings.length > 0 && (
        <AudioPlayback clips={recordings} onDiscard={onDiscard} />
      )}
    </Box>
  );
}

export default AudioRecordingControls;
