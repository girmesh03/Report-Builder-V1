/**
 * Auth API service.
 *
 * @module services/authApi
 */
import apiClient from './apiClient.js';

/**
 * Register a new user.
 *
 * @param {{ name: string, email: string, password: string }} data
 * @returns {Promise<object>}
 */
export const registerUser = (data) => apiClient('/auth/register', { method: 'POST', body: data });

/**
 * Login with email and password.
 *
 * @param {{ email: string, password: string }} data
 * @returns {Promise<object>}
 */
export const loginUser = (data) => apiClient('/auth/login', { method: 'POST', body: data });

/**
 * Logout the current user.
 *
 * @returns {Promise<object>}
 */
export const logoutUser = () => apiClient('/auth/logout', { method: 'POST' });

/**
 * Refresh the access token.
 *
 * @returns {Promise<object>}
 */
export const refreshToken = () => apiClient('/auth/refresh', { method: 'POST' });

/**
 * Get the currently authenticated user.
 *
 * @returns {Promise<object>}
 */
export const getCurrentUser = () => apiClient('/auth/me');

/**
 * Get the list of configured OAuth providers.
 *
 * @returns {Promise<object>}
 */
export const getOAuthProviders = () => apiClient('/auth/oauth/providers');
