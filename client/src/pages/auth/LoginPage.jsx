/**
 * Login page.
 *
 * Displays a card-centered login form with email and password fields,
 * OAuth provider section, and a link to the register page.
 *
 * @module pages/auth/LoginPage
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import MuiTextField from '../../components/reusable/MuiTextField.jsx';
import MuiPasswordField from '../../components/reusable/MuiPasswordField.jsx';
import MuiButton from '../../components/reusable/MuiButton.jsx';
import MuiCard from '../../components/reusable/MuiCard.jsx';
import { login, clearError } from '../../store/authSlice.js';
import { ROUTE_PATHS } from '../../utils/routePaths.js';
import * as authApi from '../../services/authApi.js';

/**
 * @returns {JSX.Element}
 */
function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [oauthProviders, setOauthProviders] = useState([]);

  useEffect(() => {
    authApi.getOAuthProviders()
      .then((response) => {
        if (response.data?.providers) {
          setOauthProviders(response.data.providers);
        }
      })
      .catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    dispatch(clearError());
    const result = await dispatch(login(data));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Login successful');
      navigate(ROUTE_PATHS.DASHBOARD);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 4 }}>
      <MuiCard sx={{ maxWidth: 480, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Sign in
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your credentials to access your account.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <MuiTextField
            fullWidth
            label="Email"
            type="email"
            autoComplete="email"
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <MuiPasswordField
            fullWidth
            label="Password"
            autoComplete="current-password"
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <MuiButton
            type="submit"
            fullWidth
            variant="contained"
            size="small"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </MuiButton>
        </form>

        {oauthProviders.length > 0 && (
          <>
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                or continue with
              </Typography>
            </Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {oauthProviders.map((provider) => (
                <MuiButton
                  key={provider.provider}
                  fullWidth
                  variant="outlined"
                  size="small"
                  disabled
                  title="OAuth setup pending — provider credentials not configured"
                >
                  {provider.provider.charAt(0).toUpperCase() + provider.provider.slice(1)}
                </MuiButton>
              ))}
            </Box>
          </>
        )}

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don&apos;t have an account?{' '}
          <Link
            slots={{ root: 'button' }}
            type="button"
            variant="body2"
            onClick={() => navigate(ROUTE_PATHS.REGISTER)}
          >
            Register
          </Link>
        </Typography>
      </MuiCard>
    </Container>
  );
}

export default LoginPage;
