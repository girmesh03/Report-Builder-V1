/**
 * Register page.
 *
 * Displays a card-centered registration form with name, email, password,
 * and confirm password fields, plus a link to the login page.
 *
 * @module pages/auth/RegisterPage
 */
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import MuiTextField from '../../components/reusable/MuiTextField.jsx';
import MuiPasswordField from '../../components/reusable/MuiPasswordField.jsx';
import MuiButton from '../../components/reusable/MuiButton.jsx';
import MuiCard from '../../components/reusable/MuiCard.jsx';
import { register as registerAction, clearError } from '../../store/authSlice.js';
import { ROUTE_PATHS } from '../../utils/routePaths.js';

/**
 * @returns {JSX.Element}
 */
function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    dispatch(clearError());
    const result = await dispatch(registerAction(data));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Registration successful');
      navigate(ROUTE_PATHS.DASHBOARD);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 4 }}>
      <MuiCard sx={{ maxWidth: 480, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Create account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Fill in the details below to get started.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <MuiTextField
            fullWidth
            label="Name"
            autoComplete="name"
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
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
            autoComplete="new-password"
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
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <MuiPasswordField
            fullWidth
            label="Confirm password"
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
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === getValues('password') || 'Passwords do not match',
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          <MuiButton
            type="submit"
            fullWidth
            variant="contained"
            size="small"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </MuiButton>
        </form>

        <Typography variant="body2" align="center">
          Already have an account?{' '}
          <Link
            slots={{ root: 'button' }}
            type="button"
            variant="body2"
            onClick={() => navigate(ROUTE_PATHS.LOGIN)}
          >
            Sign in
          </Link>
        </Typography>
      </MuiCard>
    </Container>
  );
}

export default RegisterPage;
