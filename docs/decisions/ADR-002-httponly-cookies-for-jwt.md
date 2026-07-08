# ADR-002: httpOnly Cookies for JWT Tokens

**Date:** 2026-07-05

## Context

JWT-based authentication requires the client to send a token with every API request. Common storage options are `localStorage`, `sessionStorage`, `Authorization` header (set by client JS), or `httpOnly` cookies. The security requirement is to prevent XSS-based token theft.

## Decision

Store both the access token (15 min) and refresh token (7 days) in `httpOnly` cookies, not in `localStorage`/`sessionStorage`.

- Access token cookie: `path=/api/v1`, scoped to API routes only.
- Refresh token cookie: `path=/api/v1/auth`, scoped to refresh endpoint only.
- Both cookies use `secure` in production and `sameSite: lax`.
- The frontend uses `credentials: 'include'` on all fetch calls.
- The `/auth/refresh` endpoint issues a new access token cookie and rotates the refresh token cookie transparently.

## Consequences

- **Positive**: Tokens are not accessible to JavaScript, preventing XSS-based token theft.
- **Positive**: No client-side token management code needed — cookies are automatically sent and received.
- **Positive**: Follows established secure auth patterns for SPAs with a backend API.
- **Negative**: Slightly more complex CSRF protection consideration — mitigated by `sameSite: lax` and the cookie scope separation.
- **Negative**: API client must always use `credentials: 'include'`, which requires explicit CORS configuration (`cors({ origin, credentials: true })`).
