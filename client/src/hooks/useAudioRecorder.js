/**
 * Audio recorder hook using MediaRecorder API.
 *
 * Manages an array of recordings, each with its own blob, URL, duration,
 * and MIME type. Supports starting/stopping recordings and discarding
 * individual clips.
 *
 * Audio blobs are stored in component-local refs — NOT persisted
 * to Redux or localStorage per ADR-005.
 *
 * @module hooks/useAudioRecorder
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { getSupportedMimeType } from '../utils/audioUtils.js';

let nextId = 1;

const RECORDING_STATE = Object.freeze({
  IDLE: 'idle',
  RECORDING: 'recording',
  RECORDED: 'recorded',
});

const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * @returns {object} Recording state and controls
 */
export default function useAudioRecorder() {
  const [state, setState] = useState(RECORDING_STATE.IDLE);
  const [recordings, setRecordings] = useState([]);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [mimeType, setMimeType] = useState('');
  const [mediaStream, setMediaStream] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const activeIdRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    return () => {
      stopTimer();
      stopStream();
      recordings.forEach((r) => {
        if (r.url) URL.revokeObjectURL(r.url);
      });
    };
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setDuration((Date.now() - startTimeRef.current) / 1000);
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

  const startRecording = useCallback(async () => {
    setError(null);
    setDuration(0);
    setMediaStream(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMediaStream(stream);

      const detectedMime = getSupportedMimeType();
      setMimeType(detectedMime);

      const options = detectedMime ? { mimeType: detectedMime } : {};
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      const id = nextId++;
      activeIdRef.current = id;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: detectedMime || 'audio/webm' });

        if (blob.size > MAX_FILE_SIZE) {
          setError(`Recording exceeds the 10 MB limit (${(blob.size / (1024 * 1024)).toFixed(1)} MB). Please record a shorter clip.`);
          stopTimer();
          stopStream();
          setMediaStream(null);
          setState(RECORDING_STATE.IDLE);
          return;
        }

        const url = URL.createObjectURL(blob);
        const finalDuration = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;
        startTimeRef.current = null;

        setRecordings((prev) => [
          ...prev,
          {
            id,
            blob,
            url,
            duration: finalDuration,
            mimeType: detectedMime || 'audio/webm',
            status: 'recorded',
          },
        ]);

        stopTimer();
        stopStream();
        setMediaStream(null);
        setState(RECORDING_STATE.IDLE);
        setDuration(0);
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

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const discardRecording = useCallback((id) => {
    setRecordings((prev) => {
      const target = prev.find((r) => r.id === id);
      if (target && target.url) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((r) => r.id !== id);
    });
  }, []);

  const resetRecordings = useCallback(() => {
    setRecordings((prev) => {
      prev.forEach((r) => {
        if (r.url) URL.revokeObjectURL(r.url);
      });
      return [];
    });
    setDuration(0);
    setError(null);
  }, []);

  const getAllRecordings = useCallback(() => recordings, [recordings]);

  return {
    state,
    recordings,
    duration,
    error,
    mimeType,
    fileSize: 0,
    isRecording: state === RECORDING_STATE.RECORDING,
    isIdle: state === RECORDING_STATE.IDLE,
    mediaStream,
    startRecording,
    stopRecording,
    discardRecording,
    resetRecordings,
    getAllRecordings,
  };
}
