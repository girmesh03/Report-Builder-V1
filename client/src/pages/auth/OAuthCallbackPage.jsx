/**
 * OAuth callback page (placeholder).
 *
 * This page handles the OAuth provider redirect callback.
 * Implementation depends on provider-specific setup.
 *
 * @module pages/auth/OAuthCallbackPage
 */
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { ROUTE_PATHS } from '../../utils/routePaths.js';

/**
 * @returns {JSX.Element}
 */
function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      navigate(ROUTE_PATHS.LOGIN);
      return;
    }
  }, [searchParams, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        Completing authentication...
      </Typography>
    </Box>
  );
}

export default OAuthCallbackPage;
