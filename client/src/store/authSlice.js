/**
 * Auth Redux slice.
 *
 * @module store/authSlice
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../services/authApi.js';

/**
 * Register a new user.
 *
 * @param {object} data - Registration payload (name, email, password)
 * @param {object} thunkAPI
 * @returns {Promise<object>}
 */
export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const response = await authApi.registerUser(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

/**
 * Login with email and password.
 *
 * @param {object} data - Login payload (email, password)
 * @param {object} thunkAPI
 * @returns {Promise<object>}
 */
export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const response = await authApi.loginUser(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

/**
 * Logout the current user.
 *
 * Clears local state even if the API call fails (best-effort logout).
 *
 * @returns {Promise<void>}
 */
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logoutUser();
  } catch {
    // Local state cleared by fulfilled handler regardless.
  }
});

/**
 * Fetch the currently authenticated user (used on app start).
 *
 * @returns {Promise<object>}
 */
export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getCurrentUser();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initializing: true,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.initializing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.initializing = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.initializing = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.initializing = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;
