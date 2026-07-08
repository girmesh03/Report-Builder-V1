# Phase 3 Summary — Authentication And Profile API

## Created Files

| File | Purpose |
|---|---|
| `backend/src/models/user.model.js` | User schema with pre-save bcryptjs hash, comparePassword, toPublicProfile |
| `backend/src/models/oauthAccount.model.js` | OAuth account schema linking provider accounts to users |
| `backend/src/services/auth.service.js` | Auth business logic (register, login, refresh, cookie helpers) |
| `backend/src/services/token.service.js` | JWT access/refresh token generation and verification |
| `backend/src/services/oauth.service.js` | OAuth provider list (Google placeholder until credentials configured) |
| `backend/src/middleware/auth.middleware.js` | authenticate + authorize middleware (JWT from httpOnly cookie) |
| `backend/src/middleware/validate.middleware.js` | express-validator result handler (422 on validation failure) |
| `backend/src/controllers/auth.controller.js` | register, login, logout, refresh, getMe, getOAuthProvidersList |
| `backend/src/controllers/profile.controller.js` | getProfile, updateProfile, changePassword |
| `backend/src/routes/auth.routes.js` | Auth route definitions with rate limiting + validation |
| `backend/src/routes/profile.routes.js` | Profile route definitions (all authenticated) |
| `backend/src/validators/auth.validators.js` | express-validator rules for register and login |
| `backend/src/validators/profile.validators.js` | express-validator rules for profile update and password change |
| `backend/src/utils/cookieOptions.js` | httpOnly cookie config for access and refresh tokens |

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | No | Register new user |
| POST | `/api/v1/auth/login` | No | Login with email/password |
| POST | `/api/v1/auth/logout` | No | Clear auth cookies |
| POST | `/api/v1/auth/refresh` | No | Refresh tokens via refresh cookie |
| GET | `/api/v1/auth/me` | Yes | Get current user profile |
| GET | `/api/v1/auth/oauth/providers` | No | List configured OAuth providers |
| GET | `/api/v1/profile` | Yes | Get profile |
| PATCH | `/api/v1/profile` | Yes | Update name, phone, avatarUrl |
| PATCH | `/api/v1/profile/password` | Yes | Change password |

## Key Decisions

- bcryptjs for password hashing (per ADR-001)
- express-async-handler wraps all controllers (per ADR-004)
- Write controllers use try/catch/finally with MongoDB sessions
- `normalizeEmail({ gmail_remove_dots: false })` on auth validators
- Auth-specific rate limiter (20 req/15min) on register and login
- OAuth provider-neutral service — Google stubbed until credentials are set

## Verified

- All 29 backend source files pass `node --check` syntax validation
- Health endpoint: `GET /api/v1/health` returns 200
- Register: `POST /api/v1/auth/register` returns 201 with user + sets httpOnly cookies
- Duplicate email: returns 409 with "Email already registered"
- Login: `POST /api/v1/auth/login` returns 200 with user + sets httpOnly cookies

## State After Phase 3

- Full auth system with register, login, logout, refresh, JWT cookies
- Profile CRUD endpoints with validation
- OAuth-ready architecture (service stub, model, provider endpoint)
- Protected route middleware with role-based authorization
- Ready for Phase 4 (Frontend Foundation, Routing, Auth)
