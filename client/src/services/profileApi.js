/**
 * Profile API service.
 *
 * @module services/profileApi
 */
import apiClient from './apiClient.js';

/**
 * Get the current user's profile.
 *
 * @returns {Promise<object>}
 */
export const getProfile = () => apiClient('/profile');

/**
 * Update profile fields.
 *
 * @param {{ name?: string, phone?: string, avatarUrl?: string }} data
 * @returns {Promise<object>}
 */
export const updateProfile = (data) => apiClient('/profile', { method: 'PATCH', body: data });

/**
 * Change the current user's password.
 *
 * @param {{ currentPassword: string, newPassword: string }} data
 * @returns {Promise<object>}
 */
export const changePassword = (data) => apiClient('/profile/password', { method: 'PATCH', body: data });
