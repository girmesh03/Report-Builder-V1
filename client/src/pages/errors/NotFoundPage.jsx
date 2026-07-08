/**
 * 404 Not Found page.
 *
 * @module pages/errors/NotFoundPage
 */
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import notFoundSvg from '../../assets/notFound_404.svg';
import { ROUTE_PATHS } from '../../utils/routePaths.js';

/**
 * @returns {JSX.Element}
 */
function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        px: 2,
        gap: 3,
      }}
    >
      <img
        src={notFoundSvg}
        alt="404 illustration"
        style={{ maxWidth: 400, width: '100%', height: 'auto' }}
      />
      <Typography variant="h5" color="text.secondary">
        Page not found
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Go back
        </Button>
        <Button variant="contained" onClick={() => navigate(ROUTE_PATHS.HOME)}>
          Go home
        </Button>
      </Stack>
    </Box>
  );
}

export default NotFoundPage;
