/**
 * Branches Redux slice.
 *
 * @module store/branchesSlice
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as branchesApi from '../services/branchesApi.js';

/**
 * @param {object} params
 * @returns {Promise<object>}
 */
export const fetchBranches = createAsyncThunk(
  'branches/fetchBranches',
  async (params, { rejectWithValue }) => {
    try {
      const response = await branchesApi.listBranches(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  branches: [],
  loading: false,
  error: null,
};

const branchesSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload.docs || action.payload || [];
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = branchesSlice.actions;

export default branchesSlice.reducer;
