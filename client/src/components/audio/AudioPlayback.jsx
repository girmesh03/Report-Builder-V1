/**
 * Audio playback component for a list of clips.
 *
 * Renders each clip with its own play/pause toggle, progress bar,
 * duration display, and discard button.
 *
 * @module components/audio/AudioPlayback
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiDialog from '../reusable/MuiDialog.jsx';
import MuiButton from '../reusable/MuiButton.jsx';
import { formatDuration, formatFileSize } from '../../utils/audioUtils.js';
import { API_CONFIG } from '../../utils/constants.js';

const AUDIO_BASE_URL = API_CONFIG.BASE_URL.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');

/**
 * @param {object} props
 * @param {Array<{ id: number|string, url: string, duration: number, fileSize?: number }>} props.clips - Array of clip objects
 * @param {(id: number|string) => void} props.onDiscard - Discard handler for a clip
 * @returns {JSX.Element}
 */
function AudioPlayback({ clips, onDiscard }) {
  if (!clips || clips.length === 0) return null;

  return (
    <Stack spacing={1.5}>
      {clips.map((clip) => (
        <ClipPlayer key={clip.id} clip={clip} onDiscard={onDiscard} />
      ))}
    </Stack>
  );
}

/**
 * Individual clip player with play/pause, progress, duration, and discard.
 *
 * @param {object} props
 * @param {{ id: number|string, url: string, duration: number, fileSize?: number }} props.clip
 * @param {(id: number|string) => void} props.onDiscard
 */
function ClipPlayer({ clip, onDiscard }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audioUrl = clip.url.startsWith('http') ? clip.url : `${AUDIO_BASE_URL}${clip.url}`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => {
      setPlaying(false);
      setCurrentTime(0);
    };

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [clip.url]);

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
      audio.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  }, [playing]);

  const progress = clip.duration > 0 ? (currentTime / clip.duration) * 100 : 0;

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ alignItems: 'center', width: '100%' }}
    >
      <IconButton
        onClick={togglePlayback}
        aria-label={playing ? 'Pause' : 'Play'}
        sx={{
          width: 36,
          height: 36,
          bgcolor: 'primary.main',
          color: 'common.white',
          '&:hover': { bgcolor: 'primary.dark' },
          flexShrink: 0,
        }}
      >
        {playing ? <PauseIcon sx={{ fontSize: 18 }} /> : <PlayArrowIcon sx={{ fontSize: 18 }} />}
      </IconButton>

      <Box
        sx={{
          flex: 1,
          height: 4,
          bgcolor: 'action.hover',
          borderRadius: 2,
          overflow: 'hidden',
          minWidth: 40,
        }}
      >
        <Box
          sx={{
            width: `${progress}%`,
            height: '100%',
            bgcolor: 'primary.main',
            borderRadius: 2,
          }}
        />
      </Box>

      <Typography
        variant="caption"
        fontFamily="monospace"
        color="text.secondary"
        sx={{ flexShrink: 0, whiteSpace: 'nowrap', fontSize: '0.65rem' }}
      >
        {formatDuration(currentTime)} / {formatDuration(clip.duration)}
        {clip.fileSize ? ` · ${formatFileSize(clip.fileSize)}` : ''}
      </Typography>

      <Tooltip title="Discard clip">
        <span>
          <IconButton
            size="small"
            onClick={() => setConfirmOpen(true)}
            aria-label="Discard clip"
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <MuiDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>Discard Recording</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to discard this audio recording? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setConfirmOpen(false)} color="inherit" size="small">Cancel</MuiButton>
          <MuiButton onClick={() => { setConfirmOpen(false); onDiscard(clip.id); }} color="error" variant="contained" size="small">
            Discard
          </MuiButton>
        </DialogActions>
      </MuiDialog>
    </Stack>
  );
}

export default AudioPlayback;
