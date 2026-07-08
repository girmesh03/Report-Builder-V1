# Phase 3 - Authentication And Profile API

## Phase Goal

Implement secure backend authentication and user profile APIs with email/password auth, JWT cookies, protected routes, and an OAuth-ready architecture.

## Mandatory Phase Protocol

### Step 1: Pre-Git Requirement

Run `git status`, `git branch -vv`, and `git fetch origin`. Handle missing remote, uncommitted changes, behind branches, and conflicts exactly as required. Create `phase-3-authentication-profile-api`. Verify state before implementation.

### Step 2: Comprehensive And Extremely Deep Codebase Analysis

Read all backend source, package files, env examples, docs, and phase summaries. Inspect middleware, constants, response helpers, error handler, and route mounting.

### Step 3: Comprehensive And Extremely Deep Analysis Of Previously Implemented All Phases

Analyze Phase 1 and Phase 2 outputs. Ensure auth follows existing response/error patterns and constants.

### Step 4: Phase Execution Without Deviation

Implement backend auth and profile only.

Required files or modules:

```text
backend/src/models/user.model.js
backend/src/models/oauthAccount.model.js
backend/src/controllers/auth.controller.js
backend/src/controllers/profile.controller.js
backend/src/routes/auth.routes.js
backend/src/routes/profile.routes.js
backend/src/middleware/auth.middleware.js
backend/src/services/auth.service.js
backend/src/services/token.service.js
backend/src/services/oauth.service.js
backend/src/validators/auth.validators.js
backend/src/validators/profile.validators.js
backend/src/utils/cookieOptions.js
```

User model:

- name
- email
- passwordHash
- role
- avatarUrl
- phone
- isActive
- lastLoginAt
- timestamps

OAuth account model:

- user
- provider
- providerAccountId
- email
- displayName
- access metadata if needed, but do not store provider tokens unless necessary.

Index rules:

- Do not use `unique: true` on schema fields.
- Use `userSchema.index({ email: 1 }, { unique: true })`.
- Use `oauthAccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true })`.

Methods/statics:

- Password comparison method.
- Safe public profile transform.
- Any hook/method/static that writes or queries must accept session options where relevant.

Auth endpoints:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`
- `GET /api/v1/auth/oauth/providers`
- Placeholder routes or service architecture for OAuth provider callbacks without fake credentials.

Profile endpoints:

- `GET /api/v1/profile`
- `PATCH /api/v1/profile`
- `PATCH /api/v1/profile/password`

Controller rules:

- Every controller uses `asyncHandler(async (req, res, next) => { ... })`.
- Every controller passes errors with `next(error)`.
- Every write controller uses `try`, `catch`, and `finally`.
- Every write controller supports MongoDB session/transaction where appropriate.

Validation:

- Use `express-validator`.
- Validate name, email, password, profile fields, and password change.
- Use constants for min/max lengths and roles.

Security:

- Hash passwords with `bcrypt`.
- JWT secrets from env only.
- Use httpOnly cookies.
- Use safe cookie options from config/constants.
- Do not log passwords, tokens, raw cookies, or secrets.
- Rate-limit auth routes.

OAuth:

- Add provider-neutral service interface.
- If no provider is specified, expose provider list from config and leave real callback implementation disabled until credentials exist.
- Do not install unnecessary OAuth packages until provider is chosen.
- If choosing default provider is unavoidable, ask user before installing provider-specific packages.

Update:

- `backend/.env`
- `docs/ARCHITECTURE.md`
- `docs/phases/phase-3-summary.md`

Manual verification:

- Register user.
- Login user.
- Get `/auth/me`.
- Logout.
- Update profile.
- Do not create automated tests.

### Step 5: User Review And Feedback Integration

Summarize endpoints, security decisions, OAuth status, commands run, and manual verification. Ask for explicit approval before Step 6.

### Step 6: Post-Git Requirement

After explicit approval only, complete Git status/fetch/diff/stage/commit/push/merge/delete/verify using commit message `feat: phase 3 authentication and profile api`.

## Phase Completion Criteria

- Email/password auth works.
- Profile API works.
- Protected route middleware works.
- OAuth-ready architecture exists without fake secrets.
- Docs updated.
