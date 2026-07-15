/**
 * Transcription review editor component.
 *
 * Allows the user to review and edit the raw transcription
 * before saving it for AI report generation. Includes AI-powered
 * review, re-review with feedback, and manual editing.
 *
 * Uses useState for local state management.
 *
 * @module components/reports/TranscriptionReviewEditor
 */
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FeedbackIcon from '@mui/icons-material/Feedback';
import SaveIcon from '@mui/icons-material/Save';
import MuiButton from '../reusable/MuiButton.jsx';
import MuiTextField from '../reusable/MuiTextField.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import { saveReviewedTranscription } from '../../services/reportGenerationApi.js';
import { reviewTranscriptionByAI, reReviewTranscription } from '../../services/transcriptionApi.js';

/**
 * @param {object} props
 * @param {string} props.reportId - Report ID
 * @param {string} props.initialText - Raw transcription text to pre-fill
 * @param {function} props.onReviewSaved - Called after successful save
 * @returns {JSX.Element}
 */
function TranscriptionReviewEditor({ reportId, initialText, onReviewSaved }) {
  const [text, setText] = useState(initialText || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const [reviewing, setReviewing] = useState(false);
  const [aiReviewed, setAiReviewed] = useState(false);
  const [aiChanges, setAiChanges] = useState('');
  const [noSpeech, setNoSpeech] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [reReviewing, setReReviewing] = useState(false);

  useEffect(() => {
    setText(initialText || '');
  }, [initialText]);

  const handleSave = async () => {
    if (!text.trim()) {
      setError(noSpeech ? 'Cannot save — no speech detected. Record audio with your voice first.' : 'Transcription cannot be empty.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await saveReviewedTranscription(reportId, text);
      setSaved(true);
      if (onReviewSaved) {
        onReviewSaved();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReviewByAI = async () => {
    if (!text.trim()) return;
    setReviewing(true);
    setError(null);
    setAiReviewed(false);
    setAiChanges('');
    setNoSpeech(false);
    try {
      const res = await reviewTranscriptionByAI(reportId, text);
      const data = res?.data;
      const reviewedText = data?.reviewedText;
      const changes = data?.changes || '';
      if (changes === 'No speech detected in the recording.') {
        setText(reviewedText || '');
        setNoSpeech(true);
        setAiChanges(changes);
        return;
      }
      if (reviewedText) {
        setText(reviewedText);
      }
      setAiReviewed(true);
      setAiChanges(changes);
      setShowFeedback(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setReviewing(false);
    }
  };

  const handleReReview = async () => {
    if (!text.trim() || !feedback.trim()) return;
    setReReviewing(true);
    setError(null);
    try {
      const res = await reReviewTranscription(reportId, text, feedback);
      const data = res?.data;
      if (data?.reviewedText) {
        setText(data.reviewedText);
        setAiChanges(data.changes || '');
        setFeedback('');
        setShowFeedback(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setReReviewing(false);
    }
  };

  const handleRejectAI = () => {
    setText(initialText || '');
    setAiReviewed(false);
    setAiChanges('');
    setNoSpeech(false);
    setShowFeedback(false);
    setFeedback('');
  };

  if (saved) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <CheckCircleOutlinedIcon color="success" />
              <Typography variant="subtitle1" fontWeight={600}>
                Reviewed Transcription Saved
              </Typography>
            </Stack>
            <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
              <Typography
                variant="body2"
                sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                {text}
              </Typography>
            </Card>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <RateReviewIcon color="primary" />
            <Typography variant="subtitle1" fontWeight={600}>
              Review & Edit Transcription
            </Typography>
            {aiReviewed && (
              <CheckCircleOutlinedIcon
                color="success"
                sx={{ fontSize: 18 }}
                titleAccess="AI reviewed"
              />
            )}
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Review the raw transcription, correct any errors, then save for AI
            report generation.
          </Typography>

          {aiChanges && (
            <Alert severity="info" sx={{ '& .MuiAlert-message': { width: '100%' } }}>
              <Typography variant="body2" fontWeight={600}>AI Review Changes</Typography>
              <Typography variant="body2">{aiChanges}</Typography>
            </Alert>
          )}

          <MuiTextField
            label="Transcription"
            multiline
            minRows={6}
            maxRows={20}
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
          />

          {noSpeech && (
            <Alert severity="warning">No speech detected in the recording. Please record audio with your voice.</Alert>
          )}

          {error && (
            <Alert severity="error">{error}</Alert>
          )}

          {/* AI review actions */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ flexWrap: 'wrap' }}
          >
            <MuiButton
              variant="outlined"
              onClick={handleReviewByAI}
              disabled={reviewing || !text.trim()}
              startIcon={reviewing ? <CircularProgress size={16} /> : <AutoFixHighIcon />}
              size="small"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {reviewing ? 'Reviewing...' : 'Review by AI'}
            </MuiButton>

            <MuiButton
              variant="outlined"
              onClick={() => setShowFeedback(!showFeedback)}
              startIcon={<FeedbackIcon />}
              size="small"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Re-review with Feedback
            </MuiButton>

            {aiReviewed && (
              <MuiButton
                variant="outlined"
                onClick={handleRejectAI}
                size="small"
                color="error"
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Reject AI Review
              </MuiButton>
            )}
          </Stack>

          {/* Primary save action */}
          <MuiButton
            variant="contained"
            onClick={handleSave}
            disabled={saving || !text.trim()}
            startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
            size="small"
            fullWidth
            sx={{
              py: 1,
              fontWeight: 600,
            }}
          >
            {saving ? 'Saving...' : 'Save Reviewed Transcription'}
          </MuiButton>

          {showFeedback && (
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Stack spacing={2}>
                <Typography variant="subtitle2">
                  What would you like the AI to improve?
                </Typography>
                <MuiTextField
                  label="Feedback"
                  multiline
                  minRows={2}
                  maxRows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  fullWidth
                  placeholder="e.g. Fix the branch name spelling, correct the time format..."
                />
                <MuiButton
                  variant="contained"
                  onClick={handleReReview}
                  disabled={reReviewing || !feedback.trim()}
                  startIcon={reReviewing ? <CircularProgress size={16} /> : <AutoFixHighIcon />}
                  size="small"
                  fullWidth
                  sx={{ py: 1 }}
                >
                  {reReviewing ? 'Re-reviewing...' : 'Submit Feedback & Re-review'}
                </MuiButton>
              </Stack>
            </Card>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default TranscriptionReviewEditor;
