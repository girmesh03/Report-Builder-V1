/**
 * Frontend constants.
 *
 * @module utils/constants
 */

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
