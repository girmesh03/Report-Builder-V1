/**
 * Profile page.
 *
 * Displays and edits the current user's profile (name, phone, avatarUrl)
 * and provides a change password form. Uses react-hook-form with register.
 *
 * @module pages/profile/ProfilePage
 */
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import MuiPageHeader from "../../components/reusable/MuiPageHeader.jsx";
import MuiTextField from "../../components/reusable/MuiTextField.jsx";
import MuiPasswordField from "../../components/reusable/MuiPasswordField.jsx";
import MuiButton from "../../components/reusable/MuiButton.jsx";
import MuiLoadingState from "../../components/reusable/MuiLoadingState.jsx";
import {
  fetchProfile,
  updateProfile,
  changePassword,
  clearProfileError,
} from "../../store/profileSlice.js";

/**
 * @returns {JSX.Element}
 */
function ProfilePage() {
  const dispatch = useDispatch();
  const {
    user,
    loading,
    updateLoading,
    updateError,
    passwordLoading,
    passwordError,
  } = useSelector((state) => state.profile);

  const profileForm = useForm();
  const passwordForm = useForm();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        phone: user.phone || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user, profileForm]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
      dispatch(clearProfileError());
    }
  }, [updateError, dispatch]);

  useEffect(() => {
    if (passwordError) {
      toast.error(passwordError);
      dispatch(clearProfileError());
    }
  }, [passwordError, dispatch]);

  const onSubmitProfile = useCallback(
    async (data) => {
      const result = await dispatch(updateProfile(data));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Profile updated");
      }
    },
    [dispatch],
  );

  const onSubmitPassword = useCallback(
    async (data) => {
      const result = await dispatch(changePassword(data));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Password changed");
        passwordForm.reset();
      }
    },
    [dispatch, passwordForm],
  );

  if (loading && !user) {
    return <MuiLoadingState message="Loading profile..." />;
  }

  return (
    <>
      <MuiPageHeader
        title="Profile"
        subtitle="Manage your personal information"
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 3 }}
              >
                Update your name, phone number, and avatar URL.
              </Typography>
              <form
                onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                noValidate
              >
                <MuiTextField
                  fullWidth
                  label="Name"
                  sx={{ mb: 2 }}
                  {...profileForm.register("name", {
                    required: "Name is required",
                  })}
                  error={!!profileForm.formState.errors.name}
                  helperText={profileForm.formState.errors.name?.message}
                />
                <MuiTextField
                  fullWidth
                  label="Email"
                  slotProps={{ input: { readOnly: true } }}
                  sx={{ mb: 2 }}
                  value={user?.email || ""}
                />
                <MuiTextField
                  fullWidth
                  label="Phone"
                  sx={{ mb: 2 }}
                  {...profileForm.register("phone")}
                />
                <MuiTextField
                  fullWidth
                  label="Avatar URL"
                  sx={{ mb: 2 }}
                  {...profileForm.register("avatarUrl")}
                />
                <MuiButton
                  type="submit"
                  variant="contained"
                  loading={updateLoading}
                  loadingIndicator={<CircularProgress size={20} />}
                  loadingPosition="center"
                >
                  Save Changes
                </MuiButton>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 3 }}
              >
                Enter your current password and a new password.
              </Typography>
              <form
                onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                noValidate
              >
                <MuiPasswordField
                  fullWidth
                  label="Current Password"
                  sx={{ mb: 2 }}
                  {...passwordForm.register("currentPassword", {
                    required: "Current password is required",
                  })}
                  error={!!passwordForm.formState.errors.currentPassword}
                  helperText={
                    passwordForm.formState.errors.currentPassword?.message
                  }
                />
                <MuiPasswordField
                  fullWidth
                  label="New Password"
                  sx={{ mb: 2 }}
                  {...passwordForm.register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  error={!!passwordForm.formState.errors.newPassword}
                  helperText={
                    passwordForm.formState.errors.newPassword?.message
                  }
                />
                <MuiButton
                  type="submit"
                  variant="contained"
                  loading={passwordLoading}
                  loadingIndicator={<CircularProgress size={20} />}
                  loadingPosition="center"
                >
                  Change Password
                </MuiButton>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default ProfilePage;
