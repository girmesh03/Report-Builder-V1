/**
 * Audio recorder component.
 *
 * Composes recording controls, meter, and playback
 * into a unified audio recording experience.
 * Guidelines are rendered by the parent page.
 *
 * Uses the useAudioRecorder hook for all MediaRecorder state.
 * Audio blob is stored in component-local refs per ADR-005.
 *
 * @module components/audio/AudioRecorder
 */
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import useAudioRecorder from '../../hooks/useAudioRecorder.js';
import AudioRecordingControls from './AudioRecordingControls.jsx';
import AudioRecordingMeter from './AudioRecordingMeter.jsx';
import AudioPlayback from './AudioPlayback.jsx';
import { formatFileSize, isOverSizeLimit, isSilentRecording } from '../../utils/audioUtils.js';

/**
  * @param {object} props
  * @param {(data: { blob: Blob, duration: number, mimeType: string }) => void} [props.onSubmit] - Called when user clicks submit with valid audio
  * @param {boolean} [props.disabled] - Disables submit button during upload
  * @returns {JSX.Element}
  */
function AudioRecorder({ onSubmit, disabled }) {
  const {
    duration,
    error,
    mimeType,
    audioBlob,
    audioUrl,
    fileSize,
    isIdle,
    isRecording,
    isRecorded,
    mediaStream,
    startRecording,
    stopRecording,
    discardRecording,
    reRecord,
  } = useAudioRecorder();

  const overLimit = isRecorded && isOverSizeLimit(fileSize);
  const tooSmall = isRecorded && isSilentRecording(fileSize);
  const canSubmit = isRecorded && !overLimit && !tooSmall && !disabled;

  const handleSubmit = () => {
    if (onSubmit && canSubmit) {
      onSubmit({ blob: audioBlob, duration, mimeType });
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
        isIdle={isIdle}
        isRecording={isRecording}
        onStart={startRecording}
        onStop={stopRecording}
      />

      {isRecorded && audioUrl && (
        <Box sx={{ mt: 2 }}>
          <AudioPlayback
            audioUrl={audioUrl}
            duration={duration}
            fileSize={fileSize}
            canSubmit={canSubmit}
            onSubmit={handleSubmit}
            onDiscard={discardRecording}
            onReRecord={reRecord}
          />
          {overLimit && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              File size ({formatFileSize(fileSize)}) exceeds the 10 MB limit. Please discard and
              record a shorter clip.
            </Alert>
          )}
          {tooSmall && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Recording appears to be empty ({formatFileSize(fileSize)}). Please discard and
              record again with clear speech.
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
}

export default AudioRecorder;
