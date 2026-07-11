/**
 * Audio playback component.
 *
 * Play/pause toggle with progress bar, duration display,
 * and right-aligned discard/re-record/submit actions.
 *
 * @module components/audio/AudioPlayback
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import MuiButton from '../reusable/MuiButton.jsx';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatDuration, formatFileSize } from '../../utils/audioUtils.js';

/**
 * @param {object} props
 * @param {string} props.audioUrl - Object URL of the recorded audio
 * @param {number} props.duration - Recording duration in seconds
 * @param {number} props.fileSize - File size in bytes
 * @param {boolean} props.canSubmit - Whether submit is allowed (under 10 MB)
 * @param {() => void} props.onSubmit - Submit handler
 * @param {() => void} props.onDiscard - Discard recording handler
 * @param {() => void} props.onReRecord - Re-record handler
 * @returns {JSX.Element}
 */
function AudioPlayback({
  audioUrl,
  duration,
  fileSize,
  canSubmit,
  onSubmit,
  onDiscard,
  onReRecord,
}) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setPlaying(false);
        setCurrentTime(0);
      };

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [audioUrl]);

  useEffect(() => {
    if (!playing) return;

    let rafId;
    const updateTime = () => {
      if (audioRef.current && !audioRef.current.paused) {
        setCurrentTime(audioRef.current.currentTime);
        rafId = requestAnimationFrame(updateTime);
      }
    };
    rafId = requestAnimationFrame(updateTime);

    return () => cancelAnimationFrame(rafId);
  }, [playing]);

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {
        setPlaying(false);
      });
      setPlaying(true);
    }
  }, [playing]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: 'center', width: '100%' }}
      >
        <IconButton
          onClick={togglePlayback}
          aria-label={playing ? 'Pause' : 'Play'}
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'primary.main',
            color: 'common.white',
            '&:hover': { bgcolor: 'primary.dark' },
            flexShrink: 0,
          }}
        >
          {playing ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        <Box
          sx={{
            flex: 1,
            height: 6,
            bgcolor: 'action.hover',
            borderRadius: 3,
            overflow: 'hidden',
            minWidth: 40,
          }}
        >
          <Box
            sx={{
              width: `${progress}%`,
              height: '100%',
              bgcolor: 'primary.main',
              borderRadius: 3,
            }}
          />
        </Box>

        <Typography
          variant="caption"
          fontFamily="monospace"
          color="text.secondary"
          sx={{ flexShrink: 0, whiteSpace: 'nowrap', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
        >
          {formatDuration(currentTime)} / {formatDuration(duration)}
          {' \u00B7 '}
          {formatFileSize(fileSize)}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          mt: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <MuiButton
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={onDiscard}
          aria-label="Discard recording"
          sx={{
            minWidth: { xs: 36, sm: undefined },
            px: { xs: 0.5, sm: 1 },
            '& .MuiButton-startIcon': { mr: { xs: 0, sm: 0.5 } },
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Discard
          </Box>
        </MuiButton>
        <MuiButton
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={onReRecord}
          aria-label="Re-record"
          sx={{
            minWidth: { xs: 36, sm: undefined },
            px: { xs: 0.5, sm: 1 },
            '& .MuiButton-startIcon': { mr: { xs: 0, sm: 0.5 } },
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Re-record
          </Box>
        </MuiButton>
        <MuiButton
          variant="contained"
          size="small"
          startIcon={<CheckCircleIcon />}
          onClick={onSubmit}
          disabled={!canSubmit}
          aria-label="Submit recording"
        >
          Submit
        </MuiButton>
      </Stack>
    </Box>
  );
}

export default AudioPlayback;
