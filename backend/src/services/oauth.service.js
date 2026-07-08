/**
 * OAuth provider-neutral service.
 *
 * Provides the list of configured OAuth providers. Actual callback
 * implementation is deferred until provider credentials are set in .env.
 *
 * @module services/oauth
 */
import env from '../config/env.js';

/**
 * Return the list of configured OAuth providers with their auth URLs.
 *
 * Currently only Google is stubbed. Returns an empty array if no
 * provider credentials are configured.
 *
 * @returns {Array<{ provider: string, authUrl: string|null }>}
 */
export const getOAuthProviders = () => {
  const providers = [];

  if (env.OAUTH_GOOGLE_CLIENT_ID && env.OAUTH_GOOGLE_CLIENT_SECRET) {
    providers.push({
      provider: 'google',
      authUrl: '/api/v1/auth/oauth/google',
    });
  }

  return providers;
};

/**
 * Build the Google OAuth authorization URL.
 *
 * @returns {string} Google OAuth URL
 */
export const getGoogleOAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: env.OAUTH_GOOGLE_CLIENT_ID,
    redirect_uri: env.OAUTH_GOOGLE_CALLBACK_URL,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};
