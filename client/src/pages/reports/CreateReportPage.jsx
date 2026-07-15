/**
 * Create report page.
 *
 * Shows report metadata summary after draft creation with
 * separate toggles for Report Details and Recording Tips.
 * Provides multi-clip audio recording UI — users can record
 * multiple clips, upload them all, and then transcribe/review/generate.
 *
 * @module pages/reports/CreateReportPage
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import MuiPageHeader from "../../components/reusable/MuiPageHeader.jsx";
import MuiButton from "../../components/reusable/MuiButton.jsx";
import MuiLoadingState from "../../components/reusable/MuiLoadingState.jsx";
import MuiErrorState from "../../components/reusable/MuiErrorState.jsx";
import MuiDialog from "../../components/reusable/MuiDialog.jsx";
import ReportStatusChip from "../../components/reports/ReportStatusChip.jsx";
import AudioRecorder from "../../components/audio/AudioRecorder.jsx";
import AudioPlayback from "../../components/audio/AudioPlayback.jsx";
import AudioGuidelines from "../../components/audio/AudioGuidelines.jsx";
import TranscriptionPanel from "../../components/reports/TranscriptionPanel.jsx";
import TranscriptionReviewEditor from "../../components/reports/TranscriptionReviewEditor.jsx";
import GenerateReportPanel from "../../components/reports/GenerateReportPanel.jsx";
import ReportMetadataDialog from "../../components/reports/ReportMetadataDialog.jsx";
import { getReport, updateReport } from "../../services/reportsApi.js";
import { listBranches } from "../../services/branchesApi.js";
import { uploadAudio, deleteClip } from "../../services/audioApi.js";
import { deleteTranscription } from "../../services/transcriptionApi.js";

/**
 * @returns {JSX.Element}
 */
function CreateReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transcribed, setTranscribed] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [confirmDeleteTranscription, setConfirmDeleteTranscription] = useState(false);
  const [editingReview, setEditingReview] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [branches, setBranches] = useState([]);
  const [_branchesLoading, setBranchesLoading] = useState(false);
  const [metadataUpdating, setMetadataUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getReport(id)
      .then((res) => {
        setReport(res.data);
        if (
          res.data.status === "transcribed" ||
          res.data.transcription?.status === "completed"
        ) {
          setTranscribed(true);
        }
        if (
          res.data.status === "transcription_reviewed" ||
          res.data.status === "generated" ||
          res.data.status === "finalized"
        ) {
          setTranscribed(true);
          setReviewed(true);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (branches.length === 0) {
      setBranchesLoading(true);
      listBranches({ limit: 100 })
        .then((res) => setBranches(res.data?.docs || []))
        .catch(() => {})
        .finally(() => setBranchesLoading(false));
    }
  }, [branches.length]);

  const hasAudio =
    report && report.audioClips?.length > 0;

  const handleAudioSubmit = async (clips, resetRecordings) => {
    setUploading(true);
    try {
      for (const clip of clips) {
        await uploadAudio(id, clip.blob, {
          durationSeconds: clip.duration,
          mimeType: clip.mimeType,
        });
      }
      resetRecordings();
      const updated = await getReport(id);
      setReport(updated.data);
      toast.success(`${clips.length} audio clip(s) uploaded successfully.`);
    } catch (err) {
      toast.error(err.message || "Failed to upload audio. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClip = async (clipId) => {
    try {
      await deleteClip(id, clipId);
      const updated = await getReport(id);
      setReport(updated.data);
      setTranscribed(false);
      setReviewed(false);
      toast.success("Audio clip deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete clip");
    }
  };

  const handleDeleteTranscription = async () => {
    setConfirmDeleteTranscription(false);
    try {
      await deleteTranscription(id);
      const updated = await getReport(id);
      setReport(updated.data);
      setTranscribed(false);
      setReviewed(false);
      toast.success("Transcription deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete transcription");
    }
  };

  const handleUpdateMetadata = async (data) => {
    setMetadataUpdating(true);
    try {
      await updateReport(id, data);
      const updated = await getReport(id);
      setReport(updated.data);
      setEditDialogOpen(false);
      toast.success("Report details updated");
    } catch (err) {
      toast.error(err.message || "Failed to update report details");
    } finally {
      setMetadataUpdating(false);
    }
  };

  const handleTranscriptionComplete = async (_transcriptionData) => {
    setTranscribed(true);
    try {
      const updated = await getReport(id);
      setReport(updated.data);
    } catch {
      // Silently ignore
    }
  };

  const handleReviewSaved = async () => {
    setReviewed(true);
    try {
      const updated = await getReport(id);
      setReport(updated.data);
    } catch {
      // Silently ignore
    }
  };

  const handleGenerationComplete = async (_generatedData) => {
    try {
      const updated = await getReport(id);
      setReport(updated.data);
    } catch {
      // Silently ignore
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
        <MuiErrorState message={error} onRetry={() => navigate("/reports")} />
      </>
    );
  }

  if (!report) {
    return (
      <>
        <MuiPageHeader title="Create Report" />
        <MuiErrorState
          message="Report not found"
          onRetry={() => navigate("/reports")}
        />
      </>
    );
  }

  const branchNames = (report.branches || []).map((b) => b.name).join(", ");

  return (
    <>
      <MuiPageHeader
        title="Create Report"
        subtitle="Review report details and record audio"
        action={
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {report && (report.status === "generated" || report.status === "finalized" || report.status === "exported") && (
              <MuiButton
                variant="contained"
                onClick={() => navigate(`/reports/${id}/preview`)}
                size="small"
              >
                View Report
              </MuiButton>
            )}
            <MuiButton
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/reports")}
              size="small"
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              Back to Reports
            </MuiButton>
            <Tooltip title="Back to Reports">
              <span>
                <IconButton
                  size="small"
                  onClick={() => navigate("/reports")}
                  sx={{ display: { xs: "inline-flex", sm: "none" } }}
                  aria-label="Back to reports"
                >
                  <ArrowBackIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        }
      />

      <Box sx={{ maxWidth: 600, mx: "auto", width: "100%" }}>
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => setShowDetails((prev) => !prev)}
            >
              <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Report Details
                </Typography>
                <Tooltip title="Edit details">
                  <span>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); setEditDialogOpen(true); }}
                      sx={{ color: "warning.main" }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
              <IconButton size="small" aria-label="Toggle report details">
                {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>

            <Collapse in={showDetails}>
              <ReportStatusChip status={report.status} sx={{ mt: 1, mb: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Date:</strong>{" "}
                {dayjs(report.reportDate).format("MMMM D, YYYY")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Branches:</strong> {branchNames || "Not specified"}
              </Typography>
              {report.supervisorName && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  <strong>Supervisor:</strong> {report.supervisorName}
                </Typography>
              )}
              {report.notes && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
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
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
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
                Record your day&apos;s activities in Amharic. Speak clearly
                about the branches you visited, tasks completed, issues found,
                and general observations.
              </Typography>
              <AudioGuidelines />
            </Collapse>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Audio Recording
            </Typography>
            <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
              <AudioRecorder
                onSubmit={handleAudioSubmit}
                disabled={uploading}
              />
            </Box>
            {uploading && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Uploading audio clips...
              </Alert>
            )}
          </CardContent>
        </Card>

        {report.audioClips?.length > 0 && (
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Uploaded Audio Clips
              </Typography>
              <AudioPlayback
                clips={report.audioClips.map((c) => ({
                  id: c._id,
                  url: c.url || '',
                  duration: c.duration,
                  fileSize: c.size,
                }))}
                onDiscard={(clipId) => handleDeleteClip(clipId)}
              />
            </CardContent>
          </Card>
        )}

        {hasAudio && (
          <Stack spacing={2} sx={{ mt: 2 }}>
            {!transcribed && (
              <TranscriptionPanel
                reportId={id}
                onTranscriptionComplete={handleTranscriptionComplete}
              />
            )}
            {transcribed && !reviewed && (
              <TranscriptionReviewEditor
                reportId={id}
                initialText={report.transcription?.text || ""}
                onReviewSaved={handleReviewSaved}
              />
            )}
            {reviewed && (
              <>
                {report.reviewedTranscription && !editingReview && (
                  <Card key="reviewed-transcription" variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                    <CardContent>
                      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Reviewed Transcription
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <MuiButton
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => setEditingReview(true)}
                          >
                            Edit
                          </MuiButton>
                          <MuiButton
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => setConfirmDeleteTranscription(true)}
                          >
                            Delete
                          </MuiButton>
                        </Stack>
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                      >
                        {report.reviewedTranscription}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {editingReview && (
                  <TranscriptionReviewEditor
                    reportId={id}
                    initialText={report.reviewedTranscription || report.transcription?.text || ''}
                    onReviewSaved={() => {
                      setEditingReview(false);
                      handleReviewSaved();
                    }}
                  />
                )}

                {!editingReview && (
                  <GenerateReportPanel
                    key="generate-panel"
                    reportId={id}
                    onGenerationComplete={handleGenerationComplete}
                    existingText={report?.generatedReport?.text}
                  />
                )}
              </>
            )}
          </Stack>
        )}
      </Box>

      <MuiDialog
        open={confirmDeleteTranscription}
        onClose={() => setConfirmDeleteTranscription(false)}
      >
        <DialogTitle>Delete Transcription</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the transcription? Audio clips will be preserved.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setConfirmDeleteTranscription(false)} color="inherit" size="small">Cancel</MuiButton>
          <MuiButton onClick={handleDeleteTranscription} color="error" variant="contained" size="small">
            Delete
          </MuiButton>
        </DialogActions>
      </MuiDialog>

      <ReportMetadataDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleUpdateMetadata}
        branches={branches}
        isLoading={metadataUpdating}
        initialData={report}
      />
    </>
  );
}

export default CreateReportPage;
