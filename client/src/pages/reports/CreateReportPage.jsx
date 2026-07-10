/**
 * Create report page.
 *
 * Shows report metadata summary after draft creation.
 * Audio recording UI will be added in Phase 9.
 *
 * @module pages/reports/CreateReportPage
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MicIcon from "@mui/icons-material/Mic";
import dayjs from "dayjs";
import MuiPageHeader from "../../components/reusable/MuiPageHeader.jsx";
import MuiButton from "../../components/reusable/MuiButton.jsx";
import MuiLoadingState from "../../components/reusable/MuiLoadingState.jsx";
import MuiErrorState from "../../components/reusable/MuiErrorState.jsx";
import ReportStatusChip from "../../components/reports/ReportStatusChip.jsx";
import { getReport } from "../../services/reportsApi.js";

/**
 * @returns {JSX.Element}
 */
function CreateReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getReport(id)
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

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
          <MuiButton
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/reports")}
            size="small"
          >
            Back to Reports
          </MuiButton>
        }
      />
      <Card variant="outlined" sx={{ maxWidth: 600, mx: "auto" }}>
        <CardContent>
          <ReportStatusChip status={report.status} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Date:</strong>{" "}
            {dayjs(report.reportDate).format("MMMM D, YYYY")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Branches:</strong> {branchNames || "Not specified"}
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
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3, justifyContent: "center" }}
          >
            <MuiButton
              variant="contained"
              startIcon={<MicIcon />}
              size="small"
              disabled
            >
              Record Audio (Coming Soon)
            </MuiButton>
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 2, textAlign: "center" }}
          >
            Audio recording will be available in the next update.
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}

export default CreateReportPage;
