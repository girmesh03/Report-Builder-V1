/**
 * Create report page.
 *
 * Shows report metadata summary after draft creation with
 * separate toggles for Report Details and Recording Tips.
 * Provides the audio recording UI (Phase 9) for recording
 * and preparing audio submission.
 * Audio upload (Phase 10) and transcription (Phase 11) integrated.
 *
 * @module pages/reports/CreateReportPage
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import dayjs from 'dayjs';
import MuiPageHeader from '../../components/reusable/MuiPageHeader.jsx';
import MuiButton from '../../components/reusable/MuiButton.jsx';
import MuiLoadingState from '../../components/reusable/MuiLoadingState.jsx';
import MuiErrorState from '../../components/reusable/MuiErrorState.jsx';
import ReportStatusChip from '../../components/reports/ReportStatusChip.jsx';
import AudioRecorder from '../../components/audio/AudioRecorder.jsx';
import AudioGuidelines from '../../components/audio/AudioGuidelines.jsx';
import TranscriptionPanel from '../../components/reports/TranscriptionPanel.jsx';
import { getReport } from '../../services/reportsApi.js';
import { uploadAudio } from '../../services/audioApi.js';

/**
 * @returns {JSX.Element}
 */
function CreateReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [transcribed, setTranscribed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getReport(id)
      .then((res) => {
        setReport(res.data);
        if (res.data.status !== 'draft') {
          setSubmitted(true);
          if (res.data.status === 'transcribed' || res.data.transcription?.status === 'completed') {
            setTranscribed(true);
          }
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAudioSubmit = async ({ blob, duration, mimeType }) => {
    if (report && report.status !== 'draft') {
      toast.error('Audio has already been uploaded for this report.');
      setSubmitted(true);
      return;
    }

    setUploading(true);
    try {
      await uploadAudio(id, blob, { durationSeconds: duration, mimeType });
      const updated = await getReport(id);
      setReport(updated.data);
      toast.success('Audio uploaded successfully.');
      setSubmitted(true);
    } catch (err) {
      toast.error(err.message || 'Failed to upload audio. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleTranscriptionComplete = async (_transcriptionData) => {
    setTranscribed(true);
    try {
      const updated = await getReport(id);
      setReport(updated.data);
    } catch {
      // Silently ignore — transcription data is already available
    }
  };

  if (loading) {
    return (
      <>
        <MuiPageHeader
          title="Create Report"
          subtitle="Preparing your report..."
        />
        <MuiLoadingState message="Loading report..." />
      </>
    );
  }

  if (error) {
    return (
      <>
        <MuiPageHeader title="Create Report" />
        <MuiErrorState message={error} onRetry={() => navigate('/reports')} />
      </>
    );
  }

  if (!report) {
    return (
      <>
        <MuiPageHeader title="Create Report" />
        <MuiErrorState
          message="Report not found"
          onRetry={() => navigate('/reports')}
        />
      </>
    );
  }

  const branchNames = (report.branches || []).map((b) => b.name).join(', ');

  return (
    <>
      <MuiPageHeader
        title="Create Report"
        subtitle="Review report details and record audio"
        action={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <MuiButton
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/reports')}
              size="small"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Back to Reports
            </MuiButton>
            <Tooltip title="Back to Reports">
              <span>
                <IconButton
                  size="small"
                  onClick={() => navigate('/reports')}
                  sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                  aria-label="Back to reports"
                >
                  <ArrowBackIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        }
      />

      <Box sx={{ maxWidth: 600, mx: 'auto', width: '100%' }}>
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Stack
              direction="row"
              sx={{ alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => setShowDetails((prev) => !prev)}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Report Details
              </Typography>
              <IconButton size="small" aria-label="Toggle report details">
                {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>

            <Collapse in={showDetails}>
              <ReportStatusChip status={report.status} sx={{ mt: 1, mb: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Date:</strong>{' '}
                {dayjs(report.reportDate).format('MMMM D, YYYY')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Branches:</strong> {branchNames || 'Not specified'}
              </Typography>
              {report.supervisorName && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Supervisor:</strong> {report.supervisorName}
                </Typography>
              )}
              {report.notes && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Notes:</strong> {report.notes}
                </Typography>
              )}
            </Collapse>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Stack
              direction="row"
              sx={{ alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => setShowTips((prev) => !prev)}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Recording Tips
              </Typography>
              <IconButton size="small" aria-label="Toggle recording tips">
                {showTips ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>

            <Collapse in={showTips}>
              <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                Record your day&apos;s activities in Amharic. Speak clearly about the branches you visited,
                tasks completed, issues found, and general observations.
              </Typography>
              <AudioGuidelines />
            </Collapse>
          </CardContent>
        </Card>

        {submitted ? (
          <Stack spacing={2}>
            {!transcribed && (
              <Alert severity="success">
                Audio uploaded successfully.
              </Alert>
            )}
            <TranscriptionPanel
              reportId={id}
              onTranscriptionComplete={handleTranscriptionComplete}
            />
            {transcribed && (
              <Alert severity="info">
                Transcription complete. Review and report generation will be available
                in the next update.
              </Alert>
            )}
          </Stack>
        ) : (
          <Card variant="outlined">
            <CardContent>
              <AudioRecorder onSubmit={handleAudioSubmit} disabled={uploading} />
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
}

export default CreateReportPage;
