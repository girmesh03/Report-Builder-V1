/**
 * Audio recording meter.
 *
 * Real-time waveform visualizer using Web Audio API AnalyserNode
 * with time-domain data. Mirror-center layout, full-width bars.
 *
 * @module components/audio/AudioRecordingMeter
 */
import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { formatDuration } from '../../utils/audioUtils.js';

const DISPLAY_BARS = 48;

/**
 * @param {object} props
 * @param {number} props.duration - Elapsed recording duration in seconds
 * @param {MediaStream | null} props.stream - Active microphone stream
 * @returns {JSX.Element}
 */
function AudioRecordingMeter({ duration, stream }) {
  const [amplitudes, setAmplitudes] = useState(() => new Array(DISPLAY_BARS).fill(0));
  const rafRef = useRef(null);

  useEffect(() => {
    if (!stream) return;

    let audioContext;
    let source;
    let analyser;
    let active = true;

    const init = async () => {
      try {
        audioContext = new AudioContext();
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const step = bufferLength / DISPLAY_BARS;

        const update = () => {
          if (!active) return;
          analyser.getByteTimeDomainData(dataArray);

          const bars = new Array(DISPLAY_BARS);
          for (let i = 0; i < DISPLAY_BARS; i++) {
            const start = Math.floor(i * step);
            const end = Math.floor((i + 1) * step);
            let sum = 0;
            for (let j = start; j < end; j++) {
              sum += dataArray[j];
            }
            const avg = sum / (end - start);
            const amplitude = Math.abs(avg - 128);
            bars[i] = (amplitude / 128) * 100;
          }
          setAmplitudes(bars);
          rafRef.current = requestAnimationFrame(update);
        };

        update();
      } catch {
        active = false;
      }
    };

    init();

    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (source) source.disconnect();
      if (audioContext) audioContext.close();
    };
  }, [stream]);

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 80,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: 1,
            bgcolor: 'error.light',
            opacity: 0.2,
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            gap: '1px',
          }}
        >
          {amplitudes.map((height, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                height: `${Math.max(height, height > 0 ? 1.5 : 0)}%`,
                minHeight: 0,
                bgcolor: 'error.main',
                borderRadius: '1px',
                transition: 'height 0.04s linear',
              }}
            />
          ))}
        </Box>
      </Box>
      <Typography
        variant="h6"
        fontFamily="monospace"
        color="error.main"
        sx={{ textAlign: 'center', mt: 0.5 }}
      >
        {formatDuration(duration)}
      </Typography>
    </Box>
  );
}

export default AudioRecordingMeter;
