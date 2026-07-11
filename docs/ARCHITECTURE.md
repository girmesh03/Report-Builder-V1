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
      **auth.controller.js     Auth endpoints (register, login, logout, refresh, me, OAuth)**
      **profile.controller.js  Profile endpoints (get, update, change password)**
      **branch.controller.js   Branch CRUD with pagination and soft deactivation**
      **report.controller.js   Report CRUD with pagination and user ownership (plus monthly report compilation, date-range export)**
      **audio.controller.js    Audio upload and metadata persistence**
    middleware/
      **security.middleware.js      Helmet, cors, compression, cookie-parser,
                                  mongo-sanitize, rate-limit**
      **requestLogger.middleware.js Morgan logger (development only)**
      **error.middleware.js         Global error handler (consistent JSON)**
      **notFound.middleware.js      404 handler**
      **auth.middleware.js          JWT authentication and role-based authorization**
      **validate.middleware.js      express-validator result handler**
      **upload.middleware.js        Multer configuration for audio file upload**
    models/
      **user.model.js       User schema (name, email, passwordHash, role, avatarUrl, phone, isActive, lastLoginAt)**
      **branch.model.js     Branch schema (name, code, branch, address, managerName, managerPhone, isActive)**
      **report.model.js     Report schema (user, reportDate, branches, status, supervisorName, audioClips, transcription, reviewedTranscription, generatedReport, editedReport, exportHistory)**
    routes/
      **index.js          Route aggregator**
      **health.routes.js  Health check route definitions**
      **auth.routes.js    Auth route definitions**
      **profile.routes.js Profile route definitions**
      **branch.routes.js  Branch route definitions (all authenticated)**
      **report.routes.js  Report route definitions (all authenticated, ownership enforced) — list, get, create, update, delete, monthly, export**
      **audio.routes.js   Audio upload route (POST /reports/:reportId/audio)**
    services/
      **auth.service.js   Auth business logic (register, login, refresh)**
      **token.service.js  JWT access and refresh token generation/verification**
      **oauth.service.js  OAuth provider config and provider list**
      **profile.service.js Profile business logic (get, update, change password)**
      **branch.service.js Branch CRUD with pagination, search, and soft deactivation**
      **report.service.js Report CRUD with pagination, filtering, user ownership, monthly compilation, date-range export**
      **audio.service.js  Audio upload business logic (attach clip, advance status)**
    utils/
      **constants.js      Centralized constants (no magic values elsewhere)**
      **httpStatus.js     HTTP status code constants**
      **apiError.js       Custom operational error class**
      **apiResponse.js    Standardised success response helper**
      **cookieOptions.js  httpOnly cookie configuration for access and refresh tokens**
      **logger.js         Structured logging utility**
      **fileValidation.js Audio file type, size, and duration validation**
    validators/
      **auth.validators.js    express-validator rules for register and login**
      **profile.validators.js express-validator rules for profile update and password change**
      **branch.validators.js  express-validator rules for branch create and update**
      **report.validators.js  express-validator rules for report create and update**
      **audio.validators.js   express-validator rules for audio upload metadata**
  mock/
    **index.js            Mock data injector/wiper (development only)**
  .env
  package.json
```

**Key patterns:**
- `express-async-handler` wraps all controllers and forwards errors to the global handler.
- All write controllers use try/catch/finally with MongoDB sessions/transactions. Every write endpoint follows `mongoose.startSession()` → `session.startTransaction()` → write → `session.commitTransaction()` / `session.abortTransaction()` → `session.endSession()` in `finally`.
- `mongoose-paginate-v2` for pagination on Branch and Report list endpoints.
- Centralized constants in `src/utils/constants.js` — no magic values elsewhere. Includes `BODY_PARSER_LIMIT`, `PHONE_MAX_LENGTH`, `ROLES`, `AUTH` (name/password limits), `AUTH_RATE_LIMIT`, `GENERAL_RATE_LIMIT`, `PAGINATION`, `REPORT_STATUS`, `TASK_STATUS`, `BRANCH`, and general config.
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
      audio/          **AudioRecorder, AudioPlayback, AudioRecordingControls, AudioRecordingMeter, AudioGuidelines**
      feedback/       **Toast, error boundary**
      layout/         **PublicLayout, PublicAppBar, AppShell, AppSidebar, AppTopbar, AppContent, GlobalSearchDialog**
      reusable/       MUI wrappers prefixed Mui
        **MuiTextField.jsx**
        **MuiPasswordField.jsx**
        **MuiButton.jsx**
        **MuiCard.jsx**
        **MuiSelect.jsx**
        **MuiDatePicker.jsx**
        **MuiDialog.jsx**
        **MuiDataGrid.jsx**
        **MuiPageHeader.jsx**
        **MuiEmptyState.jsx**
        **MuiLoadingState.jsx**
        **MuiErrorState.jsx**
        **MuiPagination.jsx**
    pages/
      public/         **Landing page**
      auth/           **Login, register, OAuth callback**
      dashboard/      **Dashboard landing page (summary cards + recent activity)**
      profile/        **Profile view and edit page (personal info + change password)**
      reports/        **ReportsPage** (list/grid toggle, search, filters, pagination, create dialog) and **CreateReportPage** (metadata toggle, audio recording via AudioRecorder)
      errors/         **404 page**
    hooks/            **useAudioRecorder** (MediaRecorder hook with idle/recording/recorded state machine)
    providers/        **AppThemeProvider** (wraps AppTheme for provider-layer separation)
    routes/           **Route guards (ProtectedRoute, PublicRoute)**
    services/         **API client, auth API, profile API, reportsApi, branchesApi, audioApi**
    store/            **Redux store (auth slice, profile slice, reportsSlice, branchesSlice)**
    theme/            **MUI theme config (AppTheme, themePrimitives, customizations/)**
    utils/            **Constants, route paths**
    **App.jsx**          Root layout (theme provider, error boundary, fetchCurrentUser, Outlet)
    **main.jsx**         Entry point (Redux Provider + data mode router)
  .env
  package.json
```

**Key patterns:**
- Tree-shaking MUI imports (`import TextField from '@mui/material/TextField'`).
- `sx` and `styled()` for styling; no Tailwind.
- `react-hook-form` with `register`; no `watch` or `Controller` unless documented with a code comment.
- `forwardRef` on all reusable MUI input wrappers (MuiTextField, MuiPasswordField, MuiButton, MuiCard, MuiSelect, MuiDatePicker, MuiDialog, MuiDataGrid, MuiPagination). Presentation wrappers (MuiPageHeader, MuiEmptyState, MuiLoadingState, MuiErrorState) do not require forwardRef.
- MUI Grid uses `size` prop (not `item`).
- No deprecated MUI props: `margin="normal"` → `sx={{ mb: 2 }}`, `InputProps` → `slotProps.input`, `Box component="form"` → native `<form>`, `Box component="img"` → native `<img>`, `Link component="button"` → `Link slots={{ root: 'button' }}`.
- App.jsx serves as root layout: AppThemeProvider, CssBaseline, AppErrorBoundary, AppToastContainer, `<Outlet />`, and `useEffect` dispatching `fetchCurrentUser()` on mount.
- Auth pages (LoginPage, RegisterPage) use MuiCard + MuiTextField + MuiPasswordField from `components/reusable/`. Submit buttons use MuiButton with native `loading`, `loadingIndicator={<CircularProgress size={20} />}`, and `loadingPosition="center"`. MuiPasswordField has eye toggle for show/hide — `useState`/`useCallback`, `onMouseDown` prevents focus loss, no layout shift.
- PublicLayout provides fixed AppBar + scrollable content area: outer `height: 100vh; overflow: hidden`, AppBar fixed, content `overflow-y: auto`. PublicAppBar includes logo (clickable → `/dashboard` if authenticated, `/` otherwise) and dark/light theme toggle via `useColorScheme`.
- ProtectedRoute shows loading spinner during auth initialisation, redirects to /login with `state.from` if not authenticated.
- PublicRoute (inverse guard) redirects authenticated users to `/dashboard`. Wraps login, register, and OAuth callback pages to prevent authenticated access. Generic design: adding a new public page requires only nesting it inside `<PublicRoute>`.
- apiClient uses `VITE_API_BASE_URL` with `credentials: "include"`. On 401, attempts `/auth/refresh` via direct `fetch` (not apiClient, avoids circular dependency); refresh success retries original request, refresh failure throws `SESSION_EXPIRED` which dispatches `clearAuth`. Login/register/refresh/logout excluded from 401 handling.
- authSlice handles register, login, logout, fetchCurrentUser async thunks, plus `clearAuth` action for external session-expiry dispatch.
- ReportsPage provides list (card grid `xs:12 sm:6 md:4`) and grid (MUI Data Grid) view toggle, status/branch/date filters via ReportsFilterDialog, server-side pagination via MuiPagination, and loading/empty/error states. Uses ReportsToolbar with MuiPageHeader, ReportsCardList, ReportsDataGrid, ReportsFilterDialog, ReportMetadataDialog.
- ReportsToolbar uses MuiPageHeader as outer container with filter icon (Badge), create button (icon-only on xs, full on sm+), and view toggle (ToggleButtonGroup list/grid). Title hidden on xs via MuiPageHeader.
- ReportsDataGrid uses MuiDataGrid with server-side pagination, checkbox selection, icon-only action column (view=primary.main, edit=warning.main, delete=error.main via sx theme-path strings), Tooltips wrapped in `<span>`, delete confirmation dialog with disableEnforceFocus/disableRestoreFocus, and withErrorBoundary wrapper.
- ReportMetadataDialog creates draft reports with MuiDatePicker (via Controller, documented with comment), MuiTextField select multiple for branch selection, and notes field. Uses react-hook-form.
- ReportsFilterDialog provides status select, branch select, date from/to (MuiDatePicker). Clear resets to empty defaults, applies, and closes.
- reportMetadataDialog, branchesApi, reportsApi use apiClient with query string building for pagination/search params.
- reportsSlice and branchesSlice manage report/branch state with createAsyncThunk, per-action loading/error states.
- CreateReportPage displays report metadata summary (collapsible toggle) and provides audio recording via AudioRecorder. At `/reports/:id` route.
- AudioRecorder uses useAudioRecorder hook (MediaRecorder API) with record, stop, playback, discard, re-record. No fixed duration limit. 10 MB file size enforced at submit time.
- AppSidebar responsive: permanent Drawer on `md+` (collapsible via MenuIcon), temporary Drawer on mobile (centered app name). Navigation items (Dashboard, Reports, Profile) at top with `justifyContent: 'space-between'`; Logout at bottom separated by Divider.
- AppTopbar shows current page title (dynamic from route), search icon (opens GlobalSearchDialog), theme toggle (light/dark via `useColorScheme`), and user avatar dropdown with profile link and logout.
- Dashboard displays summary cards (total/draft/generated reports) and recent activity placeholder.
- ProfilePage uses profileSlice (fetchProfile, updateProfile, changePassword) and profileApi service. Two-column layout (Grid size xs:12 md:6): personal information form (name, phone, avatarUrl) + change password form. Uses react-hook-form with register and Mui wrappers (MuiTextField, MuiPasswordField, MuiButton with native loading props).
- GlobalSearchDialog: fullScreen on mobile, dialog on tablet+. react-hook-form useForm with uncontrolled input. ArrowBackIcon start adornment clears + resets + closes. Results grouped by report/branch via Accordion. Circular SearchOffIcon for no-results state. disableEnforceFocus/disableRestoreFocus.
- MuiDatePicker explicitly switches between DesktopDatePicker (popper, md+) and MobileDatePicker (dialog, <md) via `theme.breakpoints.up('md')`.
- MuiSelect defaults `MenuProps.slotProps.paper.sx.maxHeight: 300`.
- MuiDialog defaults `disableEnforceFocus: true` and `disableRestoreFocus: true`.
- MuiButton defaults `size="small"`.
- MuiPageHeader accepts `sx` prop for outer Box overrides.
- MuiPagination defaults `color="primary"` and `shape="rounded"`.
- IconButton action colors use `sx` theme-path strings (`'primary.main'`, `'warning.main'`, `'error.main'`), never the `color` prop.
- Tooltip children wrapping IconButton or other MUI elements must be wrapped in `<span>` for reliable event-handler attachment.
- MuiEmptyState and MuiErrorState use MuiButton (not raw Button).

## Data Model Direction

Over phases, these Mongoose models will be built:

- **User** — name, email, passwordHash, role, avatarUrl, phone, isActive, lastLoginAt, timestamps. ✅ Implemented
- **Branch** — name (enum from BRANCH_NAMES constant), code, branch, address, managerName, managerPhone, isActive, timestamps. Indexes: `{ code: 1 }` unique, `{ name: 1 }`. ✅ Implemented
- **Report** — user, reportDate, branches[], status (draft→audio_recorded→transcribed→transcription_reviewed→generated→finalized→exported), languageMode, supervisorName, notes, audioClips[] (filename, mimeType, size, duration, storagePath), transcription (text, confidence, languageCode, requestId, billedDuration, status), reviewedTranscription, generatedReport (text, modelVersion, promptVersion, finishReason, inputTokens, outputTokens, status), editedReport, exportHistory[] (format, exportedAt, filename), timestamps. Indexes: `{ user: 1, reportDate: -1 }`, `{ user: 1, status: 1 }`, `{ branches: 1 }`. Paginated via `mongoose-paginate-v2`. Monthly compilation at `GET /api/v1/reports/monthly?year=&month=` and date-range export at `GET /api/v1/reports/export?dateFrom=&dateTo=`. ✅ Implemented
- **AiGeneration** — report, provider, model, promptVersion, inputSnapshot, output, usageMetadata, finishReason, status

## Pagination

Branch and Report list endpoints use `mongoose-paginate-v2` with `page`, `limit`, `sort`, `search`, and status/branch/date filters. Default page: 1, default limit: 10, max limit: 100. Defined in `backend/src/utils/constants.js` as `PAGINATION`. ✅ Implemented in Phases 7.

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

The theme is consumed through `client/src/providers/AppThemeProvider.jsx`, which wraps `AppTheme` and is wired in `App.jsx`. The `LocalizationProvider` with `AdapterDayjs` wraps the router in `main.jsx`, making date picker localization available app-wide.

## MongoDB Compass Setup

1. Start MongoDB locally (default port 27017).
2. Open MongoDB Compass.
3. Connect to `mongodb://127.0.0.1:27017`.
4. Database `report-builder-v1` is created automatically on first write.
5. Collections: `users`, `branches`, `reports`, `aigenerations`.

---

## Validation Reference

All architectural rules, coding conventions, and decision records are consolidated in **[`docs/RULES.md`](./RULES.md)** for cross-phase validation.
