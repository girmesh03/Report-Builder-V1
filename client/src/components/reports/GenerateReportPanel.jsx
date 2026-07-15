/**
 * Generate report panel component.
 *
 * Provides a button to trigger AI report generation from the
 * reviewed transcription. Shows loading state, provider errors,
 * and a basic preview placeholder.
 *
 * Full preview/edit is Phase 13.
 *
 * @module components/reports/GenerateReportPanel
 */
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import MuiButton from '../reusable/MuiButton.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import { generateReport } from '../../services/reportGenerationApi.js';

/**
 * @param {object} props
 * @param {string} props.reportId - Report ID
 * @param {function} props.onGenerationComplete - Called with generated report data
 * @param {boolean} [props.aiReviewed] - Whether transcription has been AI-reviewed
 * @param {string} [props.existingText] - Existing generated report text to display
 * @returns {JSX.Element}
 */
function GenerateReportPanel({ reportId, onGenerationComplete, aiReviewed, existingText }) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(!!existingText);
  const [reportText, setReportText] = useState(existingText || '');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingText) {
      setReportText(existingText);
      setGenerated(true);
    } else {
      setReportText('');
      setGenerated(false);
    }
  }, [existingText]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await generateReport(reportId);
      const data = res?.data;
      const text = data?.generatedReport?.text || '';
      setReportText(text);
      setGenerated(true);
      if (onGenerationComplete) {
        onGenerationComplete(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (generating) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2} sx={{ alignItems: 'center', py: 3 }}>
            <CircularProgress size={40} />
            <Typography variant="body1" color="text.secondary">
              Generating report with Addis AI...
            </Typography>
            <Typography variant="caption" color="text.secondary">
              This may take a moment. Please do not close this page.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (generated) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <ArticleIcon color="primary" />
              <Typography variant="subtitle1" fontWeight={600}>
                Generated Report
              </Typography>
            </Stack>

            {reportText ? (
              <Card variant="outlined" sx={{ bgcolor: 'grey.100', p: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                >
                  {reportText}
                </Typography>
              </Card>
            ) : (
              <Alert severity="warning">
                The generated report is empty. This may indicate a provider issue.
              </Alert>
            )}

            <MuiButton
              variant="outlined"
              onClick={handleGenerate}
              startIcon={<AutoFixHighIcon />}
              disabled={generating}
              loading={generating}
              loadingIndicator={<CircularProgress size={20} />}
              loadingPosition="center"
              size="small"
            >
              Regenerate
            </MuiButton>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Alert severity="error">{error}</Alert>
            <MuiButton
              variant="outlined"
              onClick={handleGenerate}
              startIcon={<AutoFixHighIcon />}
            >
              Retry Generation
            </MuiButton>
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
            <AutoFixHighIcon color="primary" />
            <Typography variant="subtitle1" fontWeight={600}>
              Generate AI Report
            </Typography>
            {aiReviewed && (
              <Chip
                icon={<CheckCircleOutlinedIcon />}
                label="AI Reviewed"
                size="small"
                color="success"
                variant="outlined"
              />
            )}
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Send the reviewed transcription to Addis AI to generate a
            structured daily branch supervision report.
          </Typography>

          <MuiButton
            variant="contained"
            onClick={handleGenerate}
            startIcon={<AutoFixHighIcon />}
            size="small"
          >
            Generate Report
          </MuiButton>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default GenerateReportPanel;
