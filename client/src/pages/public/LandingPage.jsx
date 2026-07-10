/**
 * Public landing page.
 *
 * @module pages/public/LandingPage
 */
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiButton from '../../components/reusable/MuiButton.jsx';
import { ROUTE_PATHS } from '../../utils/routePaths.js';

/**
 * @returns {JSX.Element}
 */
function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h3" gutterBottom fontWeight={700}>
        Report Builder V1
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
        Create professional daily branch-visit reports from recorded audio.
        Record your activity, review the transcription, and generate structured reports with AI assistance.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <MuiButton variant="contained" size="small" onClick={() => navigate(ROUTE_PATHS.REGISTER)}>
          Get started
        </MuiButton>
        <MuiButton variant="outlined" size="small" onClick={() => navigate(ROUTE_PATHS.LOGIN)}>
          Sign in
        </MuiButton>
      </Stack>
    </Box>
  );
}

export default LandingPage;
