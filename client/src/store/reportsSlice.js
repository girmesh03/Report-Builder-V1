/**
 * Reports Redux slice.
 *
 * @module store/reportsSlice
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as reportsApi from '../services/reportsApi.js';

/**
 * @param {object} params
 * @returns {Promise<object>}
 */
export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (params, { rejectWithValue }) => {
    try {
      const response = await reportsApi.listReports(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * @param {object} data
 * @returns {Promise<object>}
 */
export const createReport = createAsyncThunk(
  'reports/createReport',
  async (data, { rejectWithValue }) => {
    try {
      const response = await reportsApi.createReport(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * @param {object} params
 * @param {string} params.id
 * @param {object} params.data
 * @returns {Promise<object>}
 */
export const updateReport = createAsyncThunk(
  'reports/updateReport',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await reportsApi.updateReport(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * @param {string} id
 * @returns {Promise<object>}
 */
export const deleteReport = createAsyncThunk(
  'reports/deleteReport',
  async (id, { rejectWithValue }) => {
    try {
      const response = await reportsApi.deleteReport(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * @param {string} id
 * @returns {Promise<object>}
 */
export const archiveReport = createAsyncThunk(
  'reports/archiveReport',
  async (id, { rejectWithValue }) => {
    try {
      const response = await reportsApi.archiveReport(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * @param {string} id
 * @returns {Promise<object>}
 */
export const recoverReport = createAsyncThunk(
  'reports/recoverReport',
  async (id, { rejectWithValue }) => {
    try {
      const response = await reportsApi.recoverReport(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * @param {string} id
 * @returns {Promise<object>}
 */
export const permanentDeleteReport = createAsyncThunk(
  'reports/permanentDeleteReport',
  async (id, { rejectWithValue }) => {
    try {
      const response = await reportsApi.permanentDeleteReport(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  reports: [],
  totalDocs: 0,
  totalPages: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
  archiveLoading: false,
  archiveError: null,
  recoverLoading: false,
  recoverError: null,
  permanentDeleteLoading: false,
  permanentDeleteError: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.docs || [];
        state.totalDocs = action.payload.totalDocs || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReport.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.createLoading = false;
        state.reports = [action.payload, ...state.reports];
      })
      .addCase(createReport.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })
      .addCase(updateReport.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.reports = state.reports.map((r) =>
          r._id === action.payload?._id ? action.payload : r,
        );
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      .addCase(deleteReport.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.reports = state.reports.filter((r) => r._id !== action.payload.id);
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      })
      .addCase(archiveReport.pending, (state) => {
        state.archiveLoading = true;
        state.archiveError = null;
      })
      .addCase(archiveReport.fulfilled, (state, action) => {
        state.archiveLoading = false;
        state.reports = state.reports.map((r) =>
          r._id === action.payload?._id ? action.payload : r,
        );
      })
      .addCase(archiveReport.rejected, (state, action) => {
        state.archiveLoading = false;
        state.archiveError = action.payload;
      })
      .addCase(recoverReport.pending, (state) => {
        state.recoverLoading = true;
        state.recoverError = null;
      })
      .addCase(recoverReport.fulfilled, (state, action) => {
        state.recoverLoading = false;
        state.reports = state.reports.map((r) =>
          r._id === action.payload?._id ? action.payload : r,
        );
      })
      .addCase(recoverReport.rejected, (state, action) => {
        state.recoverLoading = false;
        state.recoverError = action.payload;
      })
      .addCase(permanentDeleteReport.pending, (state) => {
        state.permanentDeleteLoading = true;
        state.permanentDeleteError = null;
      })
      .addCase(permanentDeleteReport.fulfilled, (state, action) => {
        state.permanentDeleteLoading = false;
        state.reports = state.reports.filter((r) => r._id !== action.payload.id);
      })
      .addCase(permanentDeleteReport.rejected, (state, action) => {
        state.permanentDeleteLoading = false;
        state.permanentDeleteError = action.payload;
      });
  },
});

export const { clearError, clearCreateError, clearDeleteError } = reportsSlice.actions;

export default reportsSlice.reducer;
