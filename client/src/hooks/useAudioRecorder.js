/**
 * Audio recorder hook using MediaRecorder API.
 *
 * Manages recording state, blob creation, object URL lifecycle,
 * duration tracking, and MIME type detection.
 *
 * Audio blob is stored in component-local refs — NOT persisted
 * to Redux or localStorage per ADR-005.
 *
 * @module hooks/useAudioRecorder
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { getSupportedMimeType } from '../utils/audioUtils.js';

/**
 * Recording state enum.
 *
 * @readonly
 * @enum {string}
 */
const RECORDING_STATE = Object.freeze({
  IDLE: 'idle',
  RECORDING: 'recording',
  RECORDED: 'recorded',
});

/**
 * @returns {object} Recording state and controls
 */
export default function useAudioRecorder() {
  const [state, setState] = useState(RECORDING_STATE.IDLE);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [mimeType, setMimeType] = useState('');
  const [mediaStream, setMediaStream] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioBlobRef = useRef(null);
  const audioUrlRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      stopTimer();
      stopStream();
      revokeUrl();
    };
  }, []);

  const startTimer = useCallback(() => {
    const start = Date.now();
    timerRef.current = setInterval(() => {
      setDuration((Date.now() - start) / 1000);
    }, 250);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const revokeUrl = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  /**
   * Start audio recording.
   *
   * Requests microphone access and creates a MediaRecorder instance.
   *
   * @returns {Promise<void>}
   * @throws {Error} If microphone access is denied or MediaRecorder fails
   */
  const startRecording = useCallback(async () => {
    setError(null);
    setDuration(0);
    setMediaStream(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMediaStream(stream);

      const detectedMime = getSupportedMimeType();
      setMimeType(detectedMime);

      const options = detectedMime ? { mimeType: detectedMime } : {};
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: detectedMime || 'audio/webm' });
        audioBlobRef.current = blob;

        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        audioUrlRef.current = URL.createObjectURL(blob);

        stopTimer();
        stopStream();
        setMediaStream(null);
        setState(RECORDING_STATE.RECORDED);
      };

      recorder.onerror = () => {
        setError('Recording failed due to a browser error');
        stopTimer();
        stopStream();
        setMediaStream(null);
        setState(RECORDING_STATE.IDLE);
      };

      recorder.start();
      startTimer();
      setState(RECORDING_STATE.RECORDING);
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else {
        setError(`Could not start recording: ${err.message}`);
      }
      setMediaStream(null);
      stopStream();
    }
  }, [startTimer, stopTimer, stopStream]);

  /**
   * Stop the current recording.
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  /**
   * Discard the current recording and reset state.
   */
  const discardRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    stopTimer();
    stopStream();
    revokeUrl();
    audioBlobRef.current = null;
    chunksRef.current = [];
    setDuration(0);
    setError(null);
    setMediaStream(null);
    setState(RECORDING_STATE.IDLE);
  }, [stopTimer, stopStream, revokeUrl]);

  /**
   * Discard the current recording and immediately start a new one.
   *
   * @returns {Promise<void>}
   */
  const reRecord = useCallback(async () => {
    discardRecording();
    await startRecording();
  }, [discardRecording, startRecording]);

  const audioBlob = audioBlobRef.current;
  const audioUrl = audioUrlRef.current;

  return {
    state,
    duration,
    error,
    mimeType,
    audioBlob,
    audioUrl,
    fileSize: audioBlob ? audioBlob.size : 0,
    isRecording: state === RECORDING_STATE.RECORDING,
    isRecorded: state === RECORDING_STATE.RECORDED,
    isIdle: state === RECORDING_STATE.IDLE,
    mediaStream,
    startRecording,
    stopRecording,
    discardRecording,
    reRecord,
  };
}
