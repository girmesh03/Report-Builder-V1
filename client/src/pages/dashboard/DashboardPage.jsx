/**
 * Dashboard page.
 *
 * Displays summary stats (total, draft, generated reports) and
 * recent activity placeholder. Uses MuiPageHeader and MuiCard.
 *
 * @module pages/dashboard/DashboardPage
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DescriptionIcon from '@mui/icons-material/Description';
import EditNoteIcon from '@mui/icons-material/EditNote';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import MuiPageHeader from '../../components/reusable/MuiPageHeader.jsx';
import MuiLoadingState from '../../components/reusable/MuiLoadingState.jsx';
import { fetchProfile } from '../../store/profileSlice.js';

const STAT_CARDS = [
  { label: 'Total Reports', icon: <DescriptionIcon sx={{ fontSize: 40 }} />, color: 'primary.main', value: '0' },
  { label: 'Draft Reports', icon: <EditNoteIcon sx={{ fontSize: 40 }} />, color: 'warning.main', value: '0' },
  { label: 'Generated Reports', icon: <TaskAltIcon sx={{ fontSize: 40 }} />, color: 'success.main', value: '0' },
];

/**
 * @returns {JSX.Element}
 */
function DashboardPage() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (loading) {
    return <MuiLoadingState message="Loading dashboard..." />;
  }

  return (
    <Box>
      <MuiPageHeader title="Dashboard" subtitle="Overview of your reports and activity" />
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {STAT_CARDS.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.label}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: card.color }}>{card.icon}</Box>
                <Box>
                  <Typography variant="h4">{card.value}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {card.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Your recent reports and activities will appear here once you start creating reports.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DashboardPage;
