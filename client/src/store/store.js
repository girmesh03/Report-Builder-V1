/**
 * Redux store configuration.
 *
 * @module store/store
 */
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { logout } from './authSlice.js';
import profileReducer from './profileSlice.js';
import reportsReducer from './reportsSlice.js';
import branchesReducer from './branchesSlice.js';
import { setOnSessionExpired } from '../services/apiClient.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    reports: reportsReducer,
    branches: branchesReducer,
  },
});

setOnSessionExpired(() => store.dispatch(logout()));
