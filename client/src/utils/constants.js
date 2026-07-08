/**
 * Frontend constants.
 *
 * @module utils/constants
 */

export const API_CONFIG = Object.freeze({
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Report Builder',
});

export const AUTH_ROUTES = Object.freeze({
  LOGIN: '/login',
  REGISTER: '/register',
  OAUTH_CALLBACK: '/oauth/callback',
});

export const PROTECTED_ROUTES = Object.freeze({
  DASHBOARD: '/dashboard',
  REPORTS: '/reports',
  PROFILE: '/profile',
});
