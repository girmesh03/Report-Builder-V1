/**
 * Report preview page (read-only).
 *
 * Route: /reports/:reportId/preview
 * Shows report metadata, audio clips, transcription, and generated report
 * content in a read-only layout with finalization for generated reports.
 *
 * @module pages/reports/ReportPreviewPage
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';
import MuiPageHeader from '../../components/reusable/MuiPageHeader.jsx';
import MuiButton from '../../components/reusable/MuiButton.jsx';
import MuiLoadingState from '../../components/reusable/MuiLoadingState.jsx';
import MuiErrorState from '../../components/reusable/MuiErrorState.jsx';
import ReportStatusChip from '../../components/reports/ReportStatusChip.jsx';
import ReportPreview from '../../components/reports/ReportPreview.jsx';
import ReportFinalizeBar from '../../components/reports/ReportFinalizeBar.jsx';
import AudioPlayback from '../../components/audio/AudioPlayback.jsx';
import { getReportPreview, finalizeReport } from '../../services/reportPreviewApi.js';

/**
 * @returns {JSX.Element}
 */
function ReportPreviewPage() {
  const { id: reportId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [finalizing, setFinalizing] = useState(false);

  const loadPreview = () => {
    if (!reportId) return Promise.resolve();
    setLoading(true);
    setError(null);
    return getReportPreview(reportId)
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPreview();
  }, [reportId]);

  const handleFinalize = async () => {
    setFinalizing(true);
    try {
      await finalizeReport(reportId);
      toast.success('Report finalized successfully.');
      setReport((prev) => ({
        ...prev,
        status: 'finalized',
      }));
    } catch (err) {
      toast.error(err.message || 'Failed to finalize report. Please try again.');
    } finally {
      setFinalizing(false);
    }
  };

  if (loading) {
    return (
      <>
        <MuiPageHeader title="Report Preview" subtitle="Loading report..." />
        <MuiLoadingState message="Loading report preview..." />
      </>
    );
  }

  if (error) {
    return (
      <>
        <MuiPageHeader title="Report Preview" />
        <MuiErrorState message={error} onRetry={loadPreview} />
      </>
    );
  }

  if (!report) {
    return (
      <>
        <MuiPageHeader title="Report Preview" />
        <MuiErrorState
          message="Report not found"
          onRetry={() => navigate('/reports')}
        />
      </>
    );
  }

  const branchNames = (report.branches || []).map((b) => b.name).join(', ');
  const displayText = report.editedReport || report.generatedReport?.text || '';
  const hasContent = Boolean(displayText.trim());
  const hasAudio = report.audioClips?.length > 0;

  return (
    <>
      <MuiPageHeader
        title="Report Preview"
        subtitle={dayjs(report.reportDate).format('MMMM D, YYYY')}
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
                  aria-label="Back to reports"
                  sx={{ color: 'primary.main', display: { xs: 'inline-flex', sm: 'none' } }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        }
      />

      <Box sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
        {/* Metadata card */}
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Stack spacing={1}>
              <Stack
                direction="row"
                sx={{ alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Report Details
                </Typography>
                <ReportStatusChip status={report.status} />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                <strong>Date:</strong> {dayjs(report.reportDate).format('MMMM D, YYYY')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Branches:</strong> {branchNames || 'Not specified'}
              </Typography>
              {report.supervisorName && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Supervisor:</strong> {report.supervisorName}
                </Typography>
              )}
              {report.notes && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Notes:</strong> {report.notes}
                </Typography>
              )}
              {report.editedAt && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Last edited:</strong> {dayjs(report.editedAt).format('MMMM D, YYYY h:mm A')}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Audio clips */}
        {hasAudio && (
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Audio Clips
              </Typography>
              <AudioPlayback
                clips={report.audioClips.map((c) => ({
                  id: c._id,
                  url: c.url || '',
                  duration: c.duration,
                  fileSize: c.size,
                }))}
              />
            </CardContent>
          </Card>
        )}

        {/* Status progress */}
        {report.status !== 'draft' && report.status !== 'audio_recorded' && (
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Status Progress
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                {report.status === 'finalized' || report.status === 'exported' ? (
                  <>
                    <ReportStatusChip status="generated" />
                    <ReportStatusChip status="finalized" />
                  </>
                ) : (
                  <ReportStatusChip status={report.status} />
                )}
                {report.status === 'exported' && <ReportStatusChip status="exported" />}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Reviewed transcription */}
        {report.reviewedTranscription && (
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Reviewed Transcription
              </Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                {report.reviewedTranscription}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Generated report content */}
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Generated Report
            </Typography>

            {!hasContent ? (
              report.status === 'generated' ? (
                <Alert severity="warning">
                  The report was marked as generated but the content is empty.
                  This may indicate a provider issue.
                </Alert>
              ) : (
                <Alert severity="info">
                  No report content yet. Please generate the report first from
                  the report editing page.
                </Alert>
              )
            ) : (
              <Box
                sx={{
                  fontFamily: '"Noto Sans Ethiopic", "Inter", sans-serif',
                }}
              >
                <ReportPreview reportText={displayText} />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Finalize action */}
        <ReportFinalizeBar
          status={report.status}
          finalizing={finalizing}
          hasContent={hasContent}
          onFinalize={handleFinalize}
        />
      </Box>
    </>
  );
}

export default ReportPreviewPage;
