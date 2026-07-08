# Architecture

## Overview

Report Builder V1 follows a three-tier architecture:

```
Client (React + Vite)  →  API Server (Express)  →  MongoDB
                              ↓
                         Addis AI (proxy)
```

## Backend Architecture

**Stack:** Node.js, Express, Mongoose, ES Modules.

**Structure (implemented in bold):**

```
backend/
  src/
    **app.js              Express app setup (middleware, routes, error handlers)**
    **server.js           Entry point (HTTP server, DB connection, graceful shutdown)**
    config/
      **env.js            Environment variable loader and config object**
      **db.js             Mongoose connection setup**
    controllers/
      **health.controller.js   Health check endpoints**
      auth.controller.js     Auth endpoints (register, login, logout, refresh, me, OAuth)
      profile.controller.js  Profile endpoints (get, update, change password)
      branch.controller.js   Branch CRUD with pagination and soft deactivation
      report.controller.js   Report CRUD with pagination and user ownership
    middleware/
      **security.middleware.js      Helmet, cors, compression, cookie-parser,
                                  mongo-sanitize, rate-limit**
      **requestLogger.middleware.js Morgan logger (development only)**
      **error.middleware.js         Global error handler (consistent JSON)**
      **notFound.middleware.js      404 handler**
      auth.middleware.js          JWT authentication and role-based authorization
    models/
      user.model.js       User schema (name, email, passwordHash, role, avatarUrl, phone, isActive, lastLoginAt)
      oauthAccount.model.js  OAuth account schema (user, provider, providerAccountId)
      branch.model.js     Branch schema (name, code, area, address, managerName, managerPhone, isActive)
      report.model.js     Report schema (user, reportDate, title, branches, status, audio, transcription, generation)
    routes/
      **index.js          Route aggregator**
      **health.routes.js  Health check route definitions**
      auth.routes.js    Auth route definitions
      profile.routes.js Profile route definitions
      branch.routes.js  Branch route definitions (all authenticated)
      report.routes.js  Report route definitions (all authenticated, ownership enforced)
    services/
      auth.service.js   Auth business logic (register, login, refresh)
      token.service.js  JWT access and refresh token generation/verification
      oauth.service.js  OAuth provider config and provider list
      branch.service.js Branch CRUD with pagination, search, and soft deactivation
      report.service.js Report CRUD with pagination, filtering, and user ownership
    utils/
      **constants.js      Centralized constants (no magic values elsewhere)**
      **httpStatus.js     HTTP status code constants**
      **apiError.js       Custom operational error class**
      **apiResponse.js    Standardised success response helper**
      cookieOptions.js  httpOnly cookie configuration for access and refresh tokens
      **logger.js         Structured logging utility**
    validators/
      auth.validators.js    express-validator rules for register and login
      profile.validators.js express-validator rules for profile update and password change
      branch.validators.js  express-validator rules for branch create and update
      report.validators.js  express-validator rules for report create and update
  .env
  package.json
```

**Key patterns:**
- `express-async-handler` wraps all controllers and forwards errors to the global handler.
- All write controllers use try/catch/finally with MongoDB sessions/transactions. Every write endpoint follows `mongoose.startSession()` → `session.startTransaction()` → write → `session.commitTransaction()` / `session.abortTransaction()` → `session.endSession()` in `finally`.
- `mongoose-paginate-v2` for pagination on Branch and Report list endpoints.
- Centralized constants in `src/utils/constants.js` — no magic values elsewhere. Includes `BODY_PARSER_LIMIT`, `PHONE_MAX_LENGTH`, `ROLES`, `AUTH` (name/password limits), `AUTH_RATE_LIMIT`, `PAGINATION`, `REPORT_STATUS`, `BRANCH`, `REPORT`, and general config.
- All config values accessed via the frozen `env` config object.
- All public functions and modules documented with JSDoc (`@module`, `@param`, `@returns`, `@throws`).
- express-validator with `normalizeEmail({ gmail_remove_dots: false })` on auth endpoints to preserve Gmail plus/dot addressing.
- `helmet`, `cors`, `compression`, `cookie-parser`, `express-mongo-sanitize`, `express-rate-limit` applied globally.
- Auth-specific rate limiter on register and login routes (stricter than general).
- JWT-based auth with access token (15m) and refresh token (7d) in httpOnly cookies.
- Passwords hashed via bcryptjs pre-save hook; compared via `comparePassword` method.
- `authenticate` middleware extracts and verifies access token from cookie, attaches user to `req`.
- `authorize(...roles)` middleware checks user role against allowed roles.
- OAuth-ready architecture with provider-neutral service; Google placeholder until credentials configured.
- Global error handler distinguishes operational `ApiError` from unexpected errors.
- Graceful shutdown on SIGINT and SIGTERM.
- HTTP server starts before database connection (health endpoint reachable without DB).

## Frontend Architecture

**Stack:** React 19, Vite 8, MUI 9, Redux Toolkit, React Router 8, React Hook Form.

**Structure:**

```
client/
  public/             Static assets
  src/
    components/
      audio/          Audio recorder, playback, controls, meter, guidelines
      feedback/       Toast, error boundary
      layout/         Public layout, AppShell (AppSidebar, AppTopbar, AppContent)
      reusable/       MUI wrappers prefixed Mui
        MuiTextField.jsx
        MuiPasswordField.jsx
        MuiButton.jsx
        MuiIconButton.jsx
        MuiSelect.jsx
        MuiDatePicker.jsx
        MuiDialog.jsx
        MuiDataGrid.jsx
        MuiCard.jsx
        MuiPageHeader.jsx
        MuiEmptyState.jsx
        MuiLoadingState.jsx
        MuiErrorState.jsx
    pages/
      public/         Landing page
      auth/           Login, register, OAuth callback
      dashboard/      Dashboard landing page
      profile/        Profile view and edit page
      reports/        Reports list/grid page with search, filter, pagination
      errors/         404 page
    hooks/            Custom hooks (useAudioRecorder)
    providers/        App-level providers (AppThemeProvider)
    routes/           Route guards (ProtectedRoute)
    services/         API client functions
    store/            Redux store and slices
    theme/            MUI theme config (AppTheme, themePrimitives, customizations/)
    utils/            Helpers and constants
    RootLayout.jsx    Root layout (theme provider, error boundary, fetchCurrentUser)
    main.jsx          Entry point (data mode router config)
  .env
  package.json
```

**Key patterns:**
- Tree-shaking MUI imports in reusable components (`import TextField from '@mui/material/TextField'`).
- `sx` and `styled()` for styling; no Tailwind.
- `react-hook-form` with `register`; no `watch` or `Controller` unless documented.
- `forwardRef` on reusable MUI wrappers.
- MUI Grid uses `size` prop (not `item`).
- `MuiPasswordField` provides show/hide toggle with no layout shift.
- `MuiDialog` supports `disableEnforceFocus` and `disableRestoreFocus`.
- AppThemeProvider wraps user-provided AppTheme as a dedicated provider layer.
- Auth pages (LoginPage, RegisterPage) use reusable components (MuiTextField, MuiPasswordField, MuiButton).
- AppShell composes AppSidebar (Dashboard, Reports, Profile, Logout nav) + AppTopbar (hamburger, page title, user menu) + AppContent (Outlet).
- ReportsPage provides list (card) and grid (MUI Data Grid) view toggle, search by title, status filter, and server-side pagination.
- ReportMetadataDialog creates draft reports with date, branch selection (multi-select), title, and notes via React Hook Form.
- reportsSlice and branchesSlice manage report/branch state with createAsyncThunk for API calls.
- reportsApi and branchesApi use apiClient with query string building for pagination/search params.
- CreateReportPage displays report metadata and hosts AudioRecorder for recording branch visit audio.
- AudioRecorder uses useAudioRecorder hook (MediaRecorder API) with record, stop, playback, discard, re-record. No fixed duration limit. 10 MB file size enforced at submit time.
- AppSidebar responsive: permanent Drawer on `md+`, temporary Drawer on mobile.
- AppTopbar shows current page title and user avatar dropdown with profile link and logout.
- Dashboard displays summary cards (total/draft/generated reports) and recent activity.
- ProfilePage uses profileSlice (fetchProfile, updateProfile, changePassword) and profileApi service.

## Data Model Direction

Over phases, these Mongoose models will be built:

- **User** — name, email, passwordHash, role, avatarUrl, phone, isActive, lastLoginAt, timestamps
- **Branch** — name, code, area, address, managerName, managerPhone, isActive, timestamps. Indexes: `{ code: 1 }` unique, `{ name: 1 }`.
- **Report** — user, reportDate, title, branches[], status (draft→audio_recorded→transcribed→transcription_reviewed→generated→finalized→exported), languageMode, supervisorName, notes, audioClips[], transcription, reviewedTranscription, generatedReport, editedReport, exportHistory[], timestamps. Indexes: `{ user: 1, reportDate: -1 }`, `{ user: 1, status: 1 }`, `{ branches: 1 }`. Paginated via `mongoose-paginate-v2`.
- **AiGeneration** — report, provider, model, promptVersion, inputSnapshot, output, usageMetadata, finishReason, status

## Pagination

Branch and Report list endpoints use `mongoose-paginate-v2` with `page`, `limit`, `sort`, `search`, and status/branch/date filters. Default page: 1, default limit: 10, max limit: 100. Defined in `backend/src/utils/constants.js` as `PAGINATION`.

## Addis AI Backend Proxy

All Addis AI calls go through backend-only proxy services:

- **STT:** receives browser audio → forwards as multipart/form-data → returns transcription
- **Text generation:** sends reviewed transcription + structured prompt → returns report
- **TTS:** future scope
- **Translation:** future scope
- **Realtime:** future scope (backend-mediated WebSocket)

API keys are never exposed to the client.

## Theme

MUI theme configuration files are located in `client/src/theme/`. The theme defines the application color palette, typography (Inter font), spacing, and component overrides. 

- `themePrimitives.js` — brand colors, gray scale, semantic colors (green, orange, red), light/dark color schemes, typography, shape, shadows, layout config constants.
- `customizations/` — component-level style overrides for inputs, data display, feedback, navigation, surfaces, charts, data grid, and date pickers.
- `AppTheme.jsx` — composes the full MUI theme using `createTheme` with `cssVariables`, color schemes, and all customizations.

The theme is consumed through `client/src/providers/AppThemeProvider.jsx`, which wraps `AppTheme` and is wired in `App.jsx`. This separation keeps the raw theme config distinct from the application's provider layer.

## MongoDB Compass Setup

1. Start MongoDB locally (default port 27017).
2. Open MongoDB Compass.
3. Connect to `mongodb://127.0.0.1:27017`.
4. Database `report-builder-v1` is created automatically on first write.
5. Collections: `users`, `branches`, `reports`, `aigenerations`.
