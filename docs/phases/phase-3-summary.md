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

## Patterns Established For Future Phases

Every pattern below is an architectural rule that future phases MUST respect.

### 1. `express-async-handler` On All Controllers

**Rule:** Every controller handler is wrapped with `express-async-handler` (imported as `asyncHandler`). This forwards any thrown error or rejected promise to the global error handler via `next(error)`. Future controllers MUST follow this pattern — no manual `try/catch` + `next(error)` in controller files. Write-related business logic (with transactions) uses `try/catch/finally` inside the handler, but the handler itself is still `asyncHandler`-wrapped.

### 2. MongoDB Sessions/Transactions On Write Controllers

**Rule:** All write controllers (register, updateProfile, changePassword, future create/update/delete) MUST use MongoDB sessions with transactions:
```
const session = await mongoose.startSession();
session.startTransaction();
try {
  // ...write operations...
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;  // forwarded by asyncHandler
} finally {
  session.endSession();
}
```
This ensures atomicity. Read-only endpoints (get, list) do NOT need transactions.

### 3. JWT Auth From httpOnly Cookies (ADR-002)

**Rule:** The `authenticate` middleware extracts the JWT from `req.cookies.accessToken` (httpOnly). It verifies via `token.service.verifyAccessToken()`, looks up the user (excluding `passwordHash`), checks `isActive`, and attaches the user doc to `req.user`. Future endpoints that need authentication:
- Apply `authenticate` middleware to the route
- Access authenticated user via `req.user`
- The user doc already excludes `passwordHash` — no need to call `toPublicProfile()` again

### 4. Role-Based Authorization

**Rule:** The `authorize(...roles)` middleware returns 403 if `req.user.role` is not in the allowed roles list. Usage:
```
router.get('/admin', authenticate, authorize('admin'), handler);
```
Future phases add new roles by adding to `constants.ROLES` and applying `authorize(...)` with the appropriate role(s). The User model validates role against `constants.ROLES` enum.

### 5. bcryptjs For Password Hashing (ADR-001)

**Rule:** The User model hashes passwords via a `pre('save')` hook using bcryptjs (12 salt rounds). The `comparePassword(candidatePassword)` method uses `bcrypt.compare`. Future user-related password operations MUST use `user.comparePassword()` — never compare plaintext or use a different hashing library.

### 6. `normalizeEmail` On Auth Validators

**Rule:** Auth validators use `normalizeEmail({ gmail_remove_dots: false })` to normalize email input while preserving Gmail plus/dot addressing. This is applied in `validators/auth.validators.js` for both `registerRules` and `loginRules`. Future validators that accept email input MUST use the same normalization options.

### 7. `toPublicProfile()` On User Model

**Rule:** The User model has a `toPublicProfile()` method that returns user data without `passwordHash`. The `authenticate` middleware already excludes `passwordHash` from the user document attached to `req.user`. Future code that returns user data to the client MUST use `toPublicProfile()` or query with `.select('-passwordHash')`.

### 8. Controllers Delegate To Services

**Rule:** Controllers handle HTTP concerns only (parse request, call service, send response). Services encapsulate business logic. Future controllers MUST follow this separation:
- `controller` → parse input, call `service`, return `apiResponse` or throw `ApiError`
- `service` → business logic, DB operations, token generation
- Do NOT inline DB queries in controllers

### 9. OAuth Provider-Neutral Stub

**Rule:** OAuth architecture is provider-neutral. The `oauth.service.js` stub checks `env.OAUTH_GOOGLE_*` credentials and returns available providers via `getOAuthProviders()`. Future providers are added by extending this service — NOT by replacing it. Until credentials are configured, OAuth buttons show as disabled on the frontend.

### 10. Validators In Separate Files

**Rule:** express-validator rules live in `validators/*.js`, one file per domain. Validation results are checked via `validate.middleware.js` (returns 422 with `{ success: false, errors: [{ path, msg }] }`). Future phases add new validator files for new domains (e.g., `branch.validators.js`, `report.validators.js`) and apply them as middleware before the controller handler.

### 11. Auth-Specific Rate Limiting

**Rule:** Auth endpoints (`register`, `login`) use the `authLimiter` from `security.middleware.js` (stricter: 20 requests per 15 minutes). The general rate limiter covers all other routes. Future auth-adjacent endpoints that need strict rate limiting should use `authLimiter` or add a new limiter to `security.middleware.js`.

### 12. Constants-Based Validation

**Rule:** All validation limits (name min/max length, password min/max length, phone max length) come from `constants.AUTH.*` and `constants.PHONE_MAX_LENGTH`. Future validators MUST reference these constants — never hardcode length values in validator files.

### 13. Cookie Path Scoping (ADR-002)

**Rule:** `utils/cookieOptions.js` configures:
- Access token cookie: path `/api/v1`, 15m expiry
- Refresh token cookie: path `/api/v1/auth`, 7d expiry
- Both: `httpOnly: true`, `secure` in production, `sameSite: lax`
Future phases must NOT change cookie paths or remove httpOnly. If new auth-related cookie functionality is needed, add to `cookieOptions.js` and `auth.service.js` helpers.

### 14. Repository Pattern For Services

**Rule:** Services abstract database operations. Controllers call service methods, not Mongoose models directly. Future services (e.g., `branch.service.js`, `report.service.js`) must follow the same pattern: expose `create`, `getById`, `list`, `update`, `delete` (or domain-specific equivalents), with the controller handling HTTP formatting.
