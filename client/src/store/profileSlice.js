/**
 * Profile Redux slice.
 *
 * @module store/profileSlice
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as profileApi from '../services/profileApi.js';

/**
 * Fetch the current user's profile.
 *
 * @returns {Promise<object>}
 */
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await profileApi.getProfile();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

/**
 * Update profile fields.
 *
 * @param {{ name?: string, phone?: string, avatarUrl?: string }} data
 * @returns {Promise<object>}
 */
export const updateProfile = createAsyncThunk('profile/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const response = await profileApi.updateProfile(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

/**
 * Change the current user's password.
 *
 * @param {{ currentPassword: string, newPassword: string }} data
 * @returns {Promise<object>}
 */
export const changePassword = createAsyncThunk('profile/changePassword', async (data, { rejectWithValue }) => {
  try {
    const response = await profileApi.changePassword(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
    passwordLoading: false,
    passwordError: null,
  },
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
      state.updateError = null;
      state.passwordError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.passwordLoading = true;
        state.passwordError = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.passwordLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.passwordLoading = false;
        state.passwordError = action.payload;
      });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
