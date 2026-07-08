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
      authUrl: env.OAUTH_GOOGLE_CALLBACK_URL,
    });
  }

  return providers;
};
