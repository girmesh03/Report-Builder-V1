# Report Builder V1 — Consolidated Rules & Validation Checklist

> Extracted from every line of every document in `docs/*`. Every statement that expresses a rule, constraint, convention, decision, or requirement is captured below. Use this at any phase to validate compliance.

---

## 1. Stack & Language Rules

- [ ] **1.1** Backend: Node.js, Express, Mongoose, ES Modules only (no CommonJS, no `require()`) [ARCHITECTURE.md:15, INITIAL_PROMPT:256-258, PHASE1-SUMMARY:49]
- [ ] **1.2** Frontend: React 19, Vite 8, MUI 9, Redux Toolkit, React Router 8, React Hook Form [ARCHITECTURE.md:98, PHASE1-SUMMARY:62]
- [ ] **1.3** JavaScript only — no TypeScript, no `.ts`, no `.tsx`, no TS config [PRD.md:79, PACKAGE_DECISIONS.md:85, INITIAL_PROMPT:295]
- [ ] **1.4** No Next.js, no Remix, no other frameworks [PRD.md:80, PACKAGE_DECISIONS.md:86, INITIAL_PROMPT:296]
- [ ] **1.5** No Tailwind CSS — use MUI `sx` and `styled()` only [PRD.md:80, PACKAGE_DECISIONS.md:84, INITIAL_PROMPT:294]
- [ ] **1.6** No automated test frameworks [PACKAGE_DECISIONS.md:87, INITIAL_PROMPT:297]
- [ ] **1.7** Native `fetch` — no axios (frontend or backend) [PACKAGE_DECISIONS.md:83, INITIAL_PROMPT:258]
- [ ] **1.8** `bcryptjs` over `bcrypt` — pure-JS, identical API (ADR-001) [PACKAGE_DECISIONS.md:81, ADR-001:11-13]
- [ ] **1.9** No `cookie` package — cookie-parser handles parsing; no server-side cookie manipulation needed [PACKAGE_DECISIONS.md:79, INITIAL_PROMPT:282]
- [ ] **1.10** No frontend `dotenv` — Vite loads `VITE_`-prefixed env vars natively [PACKAGE_DECISIONS.md:80, INITIAL_PROMPT:293]
- [ ] **1.11** Root `package.json` provides `install:all`, `dev:backend`, `dev:client` — uses `npm run` (not yarn/pnpm), must not remove existing scripts [PHASE1-SUMMARY:70]
- [ ] **1.12** Client scaffolded with `npm create vite@latest --template react` — must NOT re-scaffold or migrate to different build tool [PHASE1-SUMMARY:74]

## 2. Git & Phase Protocol

- [ ] **2.1** Every phase starts with a feature branch `phase-N-description`. No direct commits to `main`. [PHASE1-SUMMARY:45, DEV-PHASES:28]
- [ ] **2.2** Phase protocol (6 steps in order): (1) Pre-Git — check status, create feature branch; (2) Deep codebase analysis; (3) Analysis of all prior phases; (4) Phase execution; (5) User review and explicit approval; (6) Post-Git — stage/commit/push/merge/delete branch. [DEV-PHASES:28-33, PHASE1-SUMMARY:45]
- [ ] **2.3** Never proceed to Step 6 without explicit user approval. [PHASE1-SUMMARY:45, INITIAL_PROMPT:481]
- [ ] **2.4** Commit messages: `feat: phase N description` for feature phases, `chore: phase N description` for hardening. [PHASE1-SUMMARY:45, PHASE16:137]
- [ ] **2.5** No amending after push. [PHASE1-SUMMARY:45]
- [ ] **2.6** Merge feature branch into `main` after approval, then delete both local and remote feature branches after verifying merge. [PHASE1-SUMMARY:45]

## 3. Backend Architecture

- [ ] **3.1** All routes mounted under `/api/v1` in `app.js`. Each route module registered in `routes/index.js`. NO routes registered directly in `app.js`. [PHASE2-SUMMARY:52-55]
- [ ] **3.2** Route aggregation: `routes/index.js` imports and mounts all route modules. New route modules must be created in `routes/`, imported and mounted in `routes/index.js`. [PHASE2-SUMMARY:52-55]
- [ ] **3.3** Error handling pipeline (2-stage): `notFound.middleware.js` (404 → ApiError) → `error.middleware.js` (4-param Express handler, distinguishes operational vs unexpected). Must NOT modify or replace this pipeline. [PHASE2-SUMMARY:59-62]
- [ ] **3.4** Security middleware stack order (fixed): `helmet → cors → compression → cookie-parser → mongo-sanitize → rate-limit`. Must NOT reorder or remove. [PHASE2-SUMMARY:66-70]
- [ ] **3.5** All middleware present: security, requestLogger, auth, error, notFound, validate. [PHASE1-6-VALIDATION:31]
- [ ] **3.6** Controllers delegate to services. Controllers handle HTTP only (parse request, call service, send response). Services encapsulate business logic/DB ops. Do NOT inline DB queries in controllers. [PHASE3-SUMMARY:116-119]
- [ ] **3.7** `express-async-handler` (from npm package, imported as `asyncHandler`) wraps ALL controller handlers. No custom wrapper (ADR-004). [PHASE3-SUMMARY:67, ADR-004:11-13]
- [ ] **3.8** All write controllers use `try/catch/finally` with MongoDB sessions/transactions: `mongoose.startSession()` → `session.startTransaction()` → write → commit/abort → `session.endSession()` in `finally`. [PHASE3-SUMMARY:71-84]
- [ ] **3.9** Read-only endpoints (get, list) do NOT need transactions. [PHASE3-SUMMARY:85]
- [ ] **3.10** Controllers forward errors via `next(error)` (handled automatically by express-async-handler). [PHASE2-SUMMARY:62]
- [ ] **3.11** Pagination uses `mongoose-paginate-v2` on Branch and Report list endpoints. Default page: 1, limit: 10, max: 100. [ARCHITECTURE.md:80, PHASE7:93, CONSTANTS:PAGINATION]
- [ ] **3.12** All constants in `backend/src/utils/constants.js` — no magic values. File is a frozen object. New constants added here, never hardcoded in controllers/services/validators. [PHASE2-SUMMARY:74, CONSTANTS]
- [ ] **3.13** All config via frozen `env` object from `config/env.js`. Never access `process.env` directly outside of `config/env.js`. [PHASE2-SUMMARY:101-105]
- [ ] **3.14** HTTP status codes imported from `utils/httpStatus.js` by semantic name — never hardcoded numeric codes. [PHASE2-SUMMARY:91-97]
- [ ] **3.15** All successful responses use `utils/apiResponse.js`: `{ success: true, message: "...", data: {...} }`. [PHASE2-SUMMARY:78-82]
- [ ] **3.16** Error responses use `utils/apiError.js`: `{ success: false, message: "..." }`. [PHASE2-SUMMARY:83-86]
- [ ] **3.17** Graceful shutdown on SIGINT/SIGTERM: `server.close()` → `mongoose.connection.close()` → `process.exit(0)`. Must NOT remove or replace. [PHASE2-SUMMARY:109-113]
- [ ] **3.18** HTTP server starts BEFORE database connection (health endpoint reachable without DB). [PHASE2-SUMMARY:117]
- [ ] **3.19** All logging via `utils/logger.js`. No `console.log` in production code. Safe logging: no passwords, tokens, raw cookies, secrets, raw audio, full transcription, or generated reports in production logs. [PHASE2-SUMMARY:121, INITIAL_PROMPT:315]
- [ ] **3.20** JSDoc block comments on all public modules (`@module`), functions (`@param`, `@returns`, `@throws`), controllers, services, utilities, models, middleware, route files. [INITIAL_PROMPT:316-317, ARCHITECTURE.md:83]
- [ ] **3.21** `validate.middleware.js` checks express-validator results — returns 422 with `{ success: false, errors: [{ path, msg }] }` on failure. [PHASE3-SUMMARY:127]
- [ ] **3.22** Validators in separate files (`validators/*.js`), one per domain. Applied as middleware before controller handler. [PHASE3-SUMMARY:127]
- [ ] **3.23** No schema field combines `unique: true` with separate indexes. Use `schema.index(...)`. [INITIAL_PROMPT:308, PHASE3:66-68]
- [ ] **3.24** Schema hooks, instance methods, static methods must accept session options where relevant. [INITIAL_PROMPT:306]
- [ ] **3.25** `normalizeEmail({ gmail_remove_dots: false })` on auth email validators. [PHASE3-SUMMARY:108, ARCHITECTURE.md:84]
- [ ] **3.26** All validation limits (name length, password length, phone length) from `constants.AUTH.*` and `constants.PHONE_MAX_LENGTH`. Never hardcoded in validator files. [PHASE3-SUMMARY:135]

## 4. Authentication & Authorization

- [ ] **4.1** JWT-based auth: access token (15m) and refresh token (7d) in httpOnly cookies (ADR-002). [ADR-002:11-14, ARCHITECTURE.md:87]
- [ ] **4.2** Access token cookie: `path=/api/v1`, 15m expiry. Refresh token cookie: `path=/api/v1/auth`, 7d expiry. Both: `httpOnly: true`, `secure` in production, `sameSite: lax`. [ADR-002:13-14, PHASE3-SUMMARY:139-143]
- [ ] **4.3** Frontend uses `credentials: 'include'` on all fetch calls. [ADR-002:16]
- [ ] **4.4** `authenticate` middleware: extracts JWT from `req.cookies.accessToken` (httpOnly), verifies via `token.service.verifyAccessToken()`, looks up user (excluding `passwordHash`), checks `isActive`, attaches user doc to `req.user`. [PHASE3-SUMMARY:89-93]
- [ ] **4.5** `authorize(...roles)` middleware: returns 403 if `req.user.role` is not in allowed roles list. [PHASE3-SUMMARY:96-99]
- [ ] **4.6** Roles defined in `constants.ROLES`. User model validates role against enum. New roles added by extending `constants.ROLES`. [PHASE3-SUMMARY:100]
- [ ] **4.7** Password hashing via `bcryptjs` `pre('save')` hook (12 salt rounds). `comparePassword(candidatePassword)` method uses `bcrypt.compare`. Never compare plaintext. (ADR-001) [PHASE3-SUMMARY:104, ADR-001]
- [ ] **4.8` `toPublicProfile()` on User model returns user data without `passwordHash`. [PHASE3-SUMMARY:112]
- [ ] **4.9** `authenticate` uses `req.user._id.toString()` throughout (not `req.user.id`). [CODE STANDARD]
- [ ] **4.10** Auth-specific rate limiter (`authLimiter`): 20 requests per 15 minutes on register and login. [PHASE3-SUMMARY:131, SECURITY:11-12]
- [ ] **4.11** OAuth architecture is provider-neutral. `oauth.service.js` checks `env.OAUTH_GOOGLE_*` credentials. Google stubbed until credentials configured. Future providers extend this service. [PHASE3-SUMMARY:123, ARCHITECTURE.md:91]
- [ ] **4.12** `GET /oauth/google` route exists with `googleOAuth` controller using `getGoogleOAuthUrl()` service. [ARCHITECTURE.md:91, PHASE5-SUMMARY:68]
- [ ] **4.13** Auth endpoints excluded from 401 auto-refresh: login, register, refresh, logout. [PHASE4-SUMMARY:87]
- [ ] **4.14** Refresh call uses direct `fetch` (not apiClient) to avoid circular dependency. [PHASE4-SUMMARY:86, PHASE4-SUMMARY:172]

## 5. Frontend Architecture

- [ ] **5.1** React Router data mode via `createBrowserRouter` + `RouterProvider`. Routes as flat array in `main.jsx`. No separate `AppRoutes.jsx` unless file becomes unmanageably large. [PHASE4-SUMMARY:79, PHASE4-SUMMARY:209]
- [ ] **5.2** All new protected routes go inside `ProtectedRoute` element's children array. All new public routes go inside `PublicLayout` element's children array. [PHASE4-SUMMARY:209-222]
- [ ] **5.3** Routes defined in `client/src/main.jsx` (not `App.jsx`). [PHASE4-SUMMARY:79]
- [ ] **5.4** `App.jsx` serves as root layout: AppThemeProvider, CssBaseline, AppErrorBoundary, AppToastContainer, `<Outlet />`, and `useEffect` dispatching `fetchCurrentUser()` on mount. [ARCHITECTURE.md:151]
- [ ] **5.5** `AppThemeProvider.jsx` at `client/src/providers/AppThemeProvider.jsx` wraps `AppTheme`. [ARCHITECTURE.md:151, PHASE5-SUMMARY:19]
- [ ] **5.6** `LocalizationProvider` with `AdapterDayjs` wraps router in `main.jsx`. [ARCHITECTURE.md:202]
- [ ] **5.7** Layout pattern (ALL layouts): outer `height: 100vh; overflow: hidden`, chrome fixed, content `overflow-y: auto`. Never scroll body/html. [PHASE4-SUMMARY:147-158]
- [ ] **5.8** PublicLayout: fixed AppBar + scrollable content area. [PHASE4-SUMMARY:93]
- [ ] **5.9** Protected layout (AppShell): AppTopbar + AppSidebar fixed → content scrolls in remaining area. Same `height: 100vh; overflow: hidden` outer wrapper. [PHASE4-SUMMARY:157]
- [ ] **5.10** AppSidebar responsive: permanent Drawer on `md+`, temporary on mobile. Nav items at top with `flexGrow: 1`; Logout at bottom with Divider. [ARCHITECTURE.md:164]
- [ ] **5.11** Logout at bottom of sidebar, separated by Divider, pushed down by `justifyContent: 'space-between'` on flex container. [ARCHITECTURE.md:164, PHASE6-SUMMARY:20]
- [ ] **5.12** PublicAppBar logo: navigates to `/dashboard` if authenticated, else `/`. [ARCHITECTURE.md:153, PHASE6-SUMMARY:21]
- [ ] **5.13` `ProtectedRoute`: shows spinner during `initializing`, `<Navigate to="/login" state={{ from: location }}>` if unauthenticated. [ARCHITECTURE.md:154, PHASE4-SUMMARY:244]
- [ ] **5.14` `PublicRoute` (inverse guard): redirects authenticated users to `/dashboard`. Wraps login, register, oauth/callback. [ARCHITECTURE.md:155]
- [ ] **5.15** Auth lifecycle: App mounts → `fetchCurrentUser()` on mount → ProtectedRoute checks `initializing` → shows spinner while true → if authenticated renders children, else redirects to login. [PHASE4-SUMMARY:241-246]
- [ ] **5.16** StrictMode double-fetch is normal: `<StrictMode>` in `main.jsx` double-invokes effects in dev — `fetchCurrentUser` fires twice on refresh. Production fires once. Do NOT remove StrictMode. [PHASE4-SUMMARY:248-249]
- [ ] **5.17** Future feature pages do NOT check `isAuthenticated` — ProtectedRoute already guards them. [PHASE4-SUMMARY:251]

## 6. Redux & State Management

- [ ] **6.1** State slices follow `createAsyncThunk` + `createSlice` pattern with `loading` and `error` state per slice. [PHASE4-SUMMARY:176-204]
- [ ] **6.2** Every slice has its own `loading` and `error` state. Do NOT share auth state for non-auth features. [PHASE4-SUMMARY:203]
- [ ] **6.3** `clearAuth` (session expiry) should reset all other slices via `extraReducers` or root reset action. [PHASE4-SUMMARY:205]
- [ ] **6.4** API errors: caught in thunk `try/catch`, returned via `rejectWithValue`, stored in slice's `error` state. [PHASE4-SUMMARY:255]
- [ ] **6.5** React errors: caught by `AppErrorBoundary` — shows fallback UI. Pages should NOT wrap themselves in individual error boundaries. [PHASE4-SUMMARY:256-259]
- [ ] **6.6** Toast notifications (`react-toastify`): non-blocking errors (e.g. SESSION_EXPIRED) dispatched as toast. `position="bottom-right"`, `autoClose={3000}`, `newestOnTop`. [PHASE4-SUMMARY:17]

## 7. API Client Rules

- [ ] **7.1** All HTTP calls go through `client/src/services/apiClient.js`. Future API service files MUST import and use `apiClient`. [PHASE4-SUMMARY:163]
- [ ] **7.2** `apiClient` uses `VITE_API_BASE_URL` from `API_CONFIG` in `utils/constants.js` with `credentials: "include"`. [ARCHITECTURE.md:156]
- [ ] **7.3** 401→refresh→retry: catches 401, attempts `/auth/refresh` via direct `fetch` (not apiClient), on success retries original request, on failure throws `SESSION_EXPIRED` (dispatches `clearAuth`). [PHASE4-SUMMARY:86, ARCHITECTURE.md:156]
- [ ] **7.4` `clearAuth` action available for external dispatch (e.g. from apiClient 401 handler). [PHASE4-SUMMARY:88]
- [ ] **7.5** Auth endpoints excluded from 401 handling: login, register, refresh, logout. [PHASE4-SUMMARY:87]

## 8. MUI & Component Rules

- [ ] **8.1** Tree-shaking MUI imports: `import TextField from '@mui/material/TextField'` — never import from barrel (`@mui/material`). [ARCHITECTURE.md:145, PHASE4-SUMMARY:235]
- [ ] **8.2** MUI Grid uses `size` prop, not `item`: `<Grid size={{ xs: 12, md: 6 }}>`. [ARCHITECTURE.md:149, INITIAL_PROMPT:325]
- [ ] **8.3** Never use deprecated MUI props: `margin="normal"` → `sx={{ mb: 2 }}`; `InputProps` → `slotProps.input`; `Box component="form"` → native `<form>`; `Box component="img"` → native `<img>`; `Link component="button"` → `Link slots={{ root: 'button' }}`. [ARCHITECTURE.md:150, PHASE4-SUMMARY:135-138]
- [ ] **8.4** Use MUI `sx` and `styled()` for styling — never Tailwind, never inline `style`. [PHASE4-SUMMARY:264, INITIAL_PROMPT:326]
- [ ] **8.5` `sx` with theme-aware tokens: `color: 'text.secondary'`, `bgcolor: 'background.paper'`, `color: 'error.main'`. Never import from `themePrimitives.js` directly. [PHASE5-SUMMARY:28-29]
- [ ] **8.6** For grey colors, use `theme.palette.grey[N]` — MUI resolves correct value for light/dark mode. Never use `gray[50]`, `gray[800]`, `brand[400]` directly. [PHASE5-SUMMARY:30]
- [ ] **8.7** All `sx` color values must be mode-aware (`text.primary`, `background.default`, `grey.500`). [PHASE5-SUMMARY:31]
- [ ] **8.8** Reusable MUI components in `client/src/components/reusable/*`, prefixed with `Mui`. [INITIAL_PROMPT:331, PHASE4-SUMMARY:228]
- [ ] **8.9** Input reusable components use `forwardRef`. Presentation wrappers (MuiPageHeader, MuiEmptyState, MuiLoadingState, MuiErrorState) do NOT need forwardRef. [ARCHITECTURE.md:148, PHASE5-SUMMARY:86]
- [ ] **8.10** Set `displayName` on wrapped components. [PHASE4-SUMMARY:231]
- [ ] **8.11** Default to `size="small"` where applicable (TextField, Select, Button). [INITIAL_PROMPT:333, PHASE4-SUMMARY:232]
- [ ] **8.12** Pass through all standard MUI props (pure wrappers — no custom API surface). [PHASE4-SUMMARY:233]
- [ ] **8.13` `slotProps.input` for input adornments (never `InputProps`). [PHASE4-SUMMARY:234]
- [ ] **8.14` `MuiPasswordField`: eye toggle via `useState`/`useCallback`, `onMouseDown` prevents focus loss, no layout shift — eye icon replaces lock icon area. Merges caller's `slotProps.input.endAdornment`. [ARCHITECTURE.md:152, PHASE5-SUMMARY:36]
- [ ] **8.15` `MuiButton`: uses MUI's native `loading`, `loadingIndicator={<CircularProgress size={20} />}`, and `loadingPosition="center"` props. `color="inherit"` not needed. [PHASE5-SUMMARY:33-49]
- [ ] **8.16` `MuiDialog`: must pass/support `disableEnforceFocus` and `disableRestoreFocus` — defaults to `true`. [INITIAL_PROMPT:339, PHASE5-SUMMARY:87]
- [ ] **8.17` `MuiDataGrid`: defaults to `disableColumnMenu: true` (can be opted-in per instance). [PHASE5-SUMMARY:88]
- [ ] **8.18** All theme configuration lives in `client/src/theme/`. Do NOT inline theme overrides in page components. Add component overrides via new files in `customizations/`. [PHASE1-SUMMARY:78-82]
- [ ] **8.19` `AppTheme.jsx` composes full MUI theme with `createTheme`, `cssVariables`, color schemes, and all customizations. [ARCHITECTURE.md:200]
- [ ] **8.20** Theme customization files use `@module` not `@file`. [PHASE5-SUMMARY:20]

## 9. react-hook-form Rules

- [ ] **9.1** All forms use `react-hook-form` with `register` only — `const { register, handleSubmit, formState: { errors } } = useForm()`. [INITIAL_PROMPT:336]
- [ ] **9.2** No `watch` — use `getValues` in validate functions for cross-field validation. [INITIAL_PROMPT:337, PHASE4-SUMMARY:271]
- [ ] **9.3** No `Controller` — unless impossible; document why in a code comment. [INITIAL_PROMPT:338, PHASE4-SUMMARY:273]
- [ ] **9.4** `formState.errors` for validation error display. Use MUI's `error` and `helperText` props on wrapped components. [PHASE4-SUMMARY:274]
- [ ] **9.5** No `useDebounce` for text input lag — use direct register integration. [INITIAL_PROMPT:335, PHASE5-SUMMARY:39]

## 10. UI & Language Rules

- [ ] **10.1** App shell, navigation, labels, buttons, validation messages, and helper text must be English. [PROJECT_OVERVIEW.md:35, INITIAL_PROMPT:58]
- [ ] **10.2** Audio, transcription, AI chat, and report content can be Amharic, English, or mixed. [PROJECT_OVERVIEW.md:36, INITIAL_PROMPT:59-62]
- [ ] **10.3** Do not force translation unless user explicitly chooses it. [PROJECT_OVERVIEW.md:36, INITIAL_PROMPT:63]
- [ ] **10.4` `size="small"` on form submit buttons. [PHASE4-SUMMARY:139]
- [ ] **10.5** Use icons in buttons where useful. [INITIAL_PROMPT:353]
- [ ] **10.6** Text must not overflow or overlap at mobile or desktop widths. [INITIAL_PROMPT:354]
- [ ] **10.7** App is an operational work tool: quiet, focused, professional UI. No oversized hero gimmicks, nested cards, decorative gradient blobs. [INITIAL_PROMPT:346-351]

## 11. Environment Variables

- [ ] **11.1` `.env` files are gitignored and NOT committed. They exist locally with placeholder/default values. No `.env.example` files (per ADR-006). [ADR-006:13, PHASE1-SUMMARY:53]
- [ ] **11.2** Backend `.env` required vars: NODE_ENV, PORT, CLIENT_ORIGIN, MONGODB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, COOKIE_SECURE, COOKIE_SAME_SITE, ADDIS_AI_BASE_URL, ADDIS_AI_API_KEY, ADDIS_AI_TEXT_MODEL, ADDIS_AI_STT_MODEL, ADDIS_AI_DEFAULT_TARGET_LANGUAGE, ADDIS_AI_STT_LANGUAGE_CODE, ADDIS_AI_TIMEOUT_MS, OAUTH_GOOGLE_CLIENT_ID, OAUTH_GOOGLE_CLIENT_SECRET, OAUTH_GOOGLE_CALLBACK_URL. [INITIAL_PROMPT:371-393]
- [ ] **11.3** Client `.env` required: VITE_API_BASE_URL, VITE_APP_NAME. [INITIAL_PROMPT:396-400]
- [ ] **11.4** Addis AI API keys (`sk_*`) must never appear in client code, Vite env vars sent to browser, localStorage, Redux state, or client logs. [INITIAL_PROMPT:81-82, RESEARCH:36-37]
- [ ] **11.5** New env vars added by: (1) adding to local `.env`, (2) adding field to config object in `config/env.js`, (3) adding validation/default logic in same file. [PHASE2-SUMMARY:101-105]

## 12. Report & Branch Domain (Phase 7+)

- [ ] **12.1** Branch model: name (enum from `constants.BRANCH_NAMES` — 14 predefined Amharic names), code (unique index), branch, address, managerName, managerPhone, isActive, timestamps. [PHASE7-SUMMARY:6]
- [ ] **12.2** Branch schema field named `branch` (not `area`). [PHASE7-SUMMARY:41]
- [ ] **12.3** Branch indexes: `{ code: 1 }` unique via `schema.index`, `{ name: 1 }`. [PHASE7-SUMMARY:6]
- [ ] **12.4** Report model: user, reportDate, branches[], status, languageMode, supervisorName (snapshot), notes, audioClips[], transcription, reviewedTranscription, generatedReport, editedReport, exportHistory[], timestamps. [PHASE7-SUMMARY:7]
- [ ] **12.5** Report statuses: draft → audio_recorded → transcribed → transcription_reviewed → generated → finalized → exported. [PHASE7-SUMMARY:9]
- [ ] **12.6** Report status stored in `constants.REPORT_STATUS`. [CONSTANTS]
- [ ] **12.7** Report indexes: `{ user: 1, reportDate: -1 }`, `{ user: 1, status: 1 }`, `{ branches: 1 }`. [PHASE7-SUMMARY:7]
- [ ] **12.8** Report creation only requires date and branch(es) — no title/description in form. Audio holds all content. [PHASE7-SUMMARY:37]
- [ ] **12.9` `supervisorName` auto-set from authenticated user on report creation. [PHASE7-SUMMARY:13]
- [ ] **12.10** Report deletion only allowed in `draft` status. [PHASE7-SUMMARY:13]
- [ ] **12.11** Owner scoping on reports (user ID filter on all queries). [PHASE7-SUMMARY:13]
- [ ] **12.12` `GET /api/v1/reports/monthly?year=&month=` registered BEFORE `/:id` to prevent route param collision. [PHASE7-SUMMARY:25]
- [ ] **12.13` `GET /api/v1/reports/export?dateFrom=&dateTo=` registered BEFORE `/:id`. [PHASE7-SUMMARY:25]
- [ ] **12.14` `TASK_STATUS` constant (PENDING/ON_PROGRESS/COMPLETED) for future task-level system. [PHASE7-SUMMARY:42]

## 13. Addis AI Integration

- [ ] **13.1** Backend-only proxy — no direct client-to-AddisAI calls. All AI calls go through backend proxy services. [ARCHITECTURE.md:184-192, RESEARCH:75]
- [ ] **13.2** API keys (`sk_*`) stored only in backend environment variables, never in frontend. [PRD.md:87, RESEARCH:36]
- [ ] **13.3** AI endpoints protected by authentication. [PRD.md:89]
- [ ] **13.4** Rate limits on auth and AI endpoints. [PRD.md:90]
- [ ] **13.5** STT endpoint: `POST /api/v2/stt`, multipart/form-data, fields: `audio` (file), `request_data` (stringified JSON with `language_code`). [INITIAL_PROMPT:89-96]
- [ ] **13.6** Text generation: `POST /api/v1/chat_generate`, JSON, fields: model, prompt, target_language, generation_config (temperature 0.2 for reports). [INITIAL_PROMPT:104-117]
- [ ] **13.7** Main text model: `Addis-፩-አሌፍ`. [INITIAL_PROMPT:86]
- [ ] **13.8** STT limits: max 60 seconds, max 10 MB per request. [INITIAL_PROMPT:99]
- [ ] **13.9** Supported audio formats: WAV, MP3, M4A, WebM. [RESEARCH:35]
- [ ] **13.10** Recommended: WAV, 16kHz+, mono, quiet environment. [RESEARCH:36]
- [ ] **13.11** STT optimized for single-speaker audio. [INITIAL_PROMPT:100]
- [ ] **13.12** No fixed duration limit on frontend recording — 10 MB file size enforced client-side after recording stops. Long recordings chunked by backend for STT. (ADR-005) [ADR-005:16-26]
- [ ] **13.13** Transcription review is mandatory before report generation. Report generation uses reviewed transcription, not raw unreviewed STT output. [INITIAL_PROMPT:224, RESEARCH:79]
- [ ] **13.14** Audio blob in component-local state (`useState` + `useRef`). Not persisted to Redux, redux-persist, or localStorage. [ADR-005:34]
- [ ] **13.15** MIME type priority (ADR-005): `audio/webm;codecs=opus` → `audio/webm` → `audio/mp4` → browser default. [ADR-005:38-42]
- [ ] **13.16** No multimodal audio for core V1 flow — use STT first because transcription review is required. [INITIAL_PROMPT:138, RESEARCH:195-196]
- [ ] **13.17** Audio validation: file required, max 10 MB, allowed MIME types. Duration metadata is informational — no hard duration limit on upload. Long audio is chunked by backend at STT time. [PHASE10:51-63, ADR-005:30-31]
- [ ] **13.18** Multer for receiving browser audio uploads. [PHASE10:64]
- [ ] **13.19** Audio stored temporarily under `backend/uploads/audio/` with `.gitignore`. Uploaded files not committed. [PHASE10:64-65]
- [ ] **13.20** Do not log raw audio, raw transcription, or generated reports in production. [INITIAL_PROMPT:315, PRD.md:83]
- [ ] **13.21** **Transcription accuracy is the single most important quality metric.** Every implementation decision — chunking strategy, format conversion, MIME type, error handling — must prioritize transcription accuracy over convenience, performance, or code simplicity. [PHASE11-AUDIT]
- [ ] **13.22** **Chunk MIME type MUST match actual buffer format.** After ffmpeg WAV conversion + PCM split, each chunk buffer contains a RIFF/WAVE header. The Blob's `type` MUST be set to `audio/wav` for these chunks. Using the original `audio/webm` type causes the provider to misinterpret the data, producing garbled transcription. This is a CRITICAL violation. [PHASE11-AUDIT]
- [ ] **13.23** **The only approved chunking pipeline** for STT is: ffmpeg full-file WAV conversion (pcm_s16le, 16kHz, mono) → in-memory PCM-level WAV split via `wavSplitter.js`. Any alternative chunking approach that degrades accuracy (e.g., per-segment ffmpeg re-encoding, sending raw format without conversion) is forbidden unless proven to produce equivalent accuracy. [PHASE11-AUDIT]
- [ ] **13.24** **Re-transcription MUST be available** so accuracy can be verified across multiple attempts. The backend must accept both `audio_recorded` and `transcribed` statuses. The frontend must show a "Re-transcribe" button on completed transcription. [PHASE11-AUDIT]
- [ ] **13.25** **Accuracy regression is a blocking defect.** Any change to the STT pipeline (chunking, format conversion, MIME type, language code, provider endpoint) that degrades transcription quality must be reverted immediately. Accuracy must be verified with real Amharic audio before merging. [PHASE11-AUDIT]

## 14. Export Rules

- [ ] **14.1** PDF: `jspdf` + `jspdf-autotable`. Handle Amharic text. Include report metadata + sections. [PRD.md:100, PHASE14:45-48]
- [ ] **14.2** TXT: Blob download with UTF-8. Preserve Amharic text and line breaks. [PRD.md:101, PHASE14:51-53]
- [ ] **14.3** CSV: Data Grid CSV export or custom CSV. UTF-8 BOM for Excel compatibility. Escape formulas to prevent injection. Columns: title, date, branches, status, createdAt, updatedAt. [PRD.md:102, PHASE14:57-67]
- [ ] **14.4** Spreadsheet: `exceljs` + `file-saver`. `.xlsx` with workbook metadata. UTF-8 text. Do NOT assume community `@mui/x-data-grid` supports Excel export. [PRD.md:103, PHASE14:70-74]
- [ ] **14.5** Export menu on report preview + export actions on reports page. Disable export if no generated/edited content. [PHASE14:78-81]
- [ ] **14.6** After export, report can be marked/export history appended. Do NOT overwrite finalized content. [PHASE14:94-95]

## 15. AI Prompt Rules (PROBLEM_STATEMENT.md)

- [ ] **15.1** Generate report in Amharic. [PROBLEM.md:323]
- [ ] **15.2** Use exact section structure required by report format. [PROBLEM.md:324]
- [ ] **15.3** Match tone and writing style of provided samples (professional, direct, clear, work-report oriented, from supervisor's perspective). [PROBLEM.md:325, 297-309]
- [ ] **15.4** Use reviewed transcription as source of truth. [PROBLEM.md:326]
- [ ] **15.5** Do NOT invent missing dates, branch names, times, actions, people, problems, or opinions. [PROBLEM.md:327]
- [ ] **15.6** If required information is missing, leave blank or mark as not specified. [PROBLEM.md:328]
- [ ] **15.7** Separate completed activities from unresolved issues. [PROBLEM.md:329]
- [ ] **15.8** Urgent problems under `መፍትሄ የሚፈሉ ጉዳዮች`. [PROBLEM.md:330]
- [ ] **15.9** General opinion under `አጠቃላይ አስተያየት`. [PROBLEM.md:331]
- [ ] **15.10** Preserve branch-specific details for multi-branch reports. [PROBLEM.md:332]
- [ ] **15.11** Preserve time ranges per branch. [PROBLEM.md:333]
- [ ] **15.12** Write from supervisor's point of view. [PROBLEM.md:334]
- [ ] **15.13** Do NOT output explanation of how report was generated. [PROBLEM.md:335]
- [ ] **15.14** Do NOT include unrelated conversation content. [PROBLEM.md:336]
- [ ] **15.15** Do NOT include Person 2's questions unless answer contains report information. [PROBLEM.md:337]
- [ ] **15.16** For corrections: update only relevant part, do not rewrite correct unrelated sections. [PROBLEM.md:338, 395]
- [ ] **15.17** English/technical words in Amharic audio: write in common Amharic workplace transliteration, not literal translation. E.g., `deep fryer` → `ዲፕ ፍራየር`, not `ጥልቅ መጥበሻ`. [PROBLEM.md:342-362]
- [ ] **15.18** Report format (tentative Amharic): ቀን, ብራንች, ስም, ስራ የገባሁበት ሰዓት, የተሰሩ ስራዎች, መፍትሄ የሚፈሉ ጉዳዮች, አጠቃላይ አስተያየት, ከስራ የወጣሁበት ሰዓት. [PROBLEM.md:189-211]
- [ ] **15.19** Multi-branch reports: show time range per branch. [PROBLEM.md:213]
- [ ] **15.20** The transcription is NOT the final report — it is raw material for AI to organize. [PROBLEM.md:366-380]

## 16. Mock Data Rules

- [ ] **16.1** Users: 2 area_supervisors (beza ayalew, mehadir getachew), plain-text passwords in data.js — User model pre('save') hook hashes them. [PHASE7-SUMMARY:29-31]
- [ ] **16.2** Branches: 14 with Amharic names matching BRANCH_NAMES constant. [PHASE7-SUMMARY:29, DATA:BRANCHES]
- [ ] **16.3** Reports: 11 — 5 for beza, 6 for mehadir, spread across all workflow statuses. [PHASE7-SUMMARY:29, DATA:REPORTS]
- [ ] **16.4` `--inject`: seeds all data using MongoDB session/transaction, `ordered: true`. Always deletes + re-creates reports for idempotency. [PHASE7-SUMMARY:31-33]
- [ ] **16.5` `--wipe`: drops collections (users, branches, reports, oauthaccounts, aigenerations) — DDL outside transaction for Atlas compatibility. [PHASE7-SUMMARY:32]
- [ ] **16.6** Refuses to run outside development mode. [PHASE7-SUMMARY:34]

## 17. Code Quality Rules

- [ ] **17.1** ES Modules only throughout backend (`"type": "module"` in `backend/package.json`). [PHASE1-SUMMARY:49]
- [ ] **17.2** JSDoc on all public modules (`@module`), functions (`@param`, `@returns`, `@throws`), constants (`@type`), exports. [ARCHITECTURE.md:83]
- [ ] **17.3** Unused parameters: use `_` prefix (e.g., `_req`, `_res`, `_next`) to signal intentional non-use. [CODE STANDARD]
- [ ] **17.4** No unused imports — every `import X from Y` must be referenced in file body. [CODE STANDARD]
- [ ] **17.5** No unused exports — every exported function/const must be imported elsewhere. [CODE STANDARD]
- [ ] **17.6** No dead code — remove unused constants, variables, methods. [CODE STANDARD]
- [ ] **17.7** All 30+ backend source files must pass `node --check` syntax validation. [PHASE1-6-VALIDATION:39]
- [ ] **17.8** Frontend must pass `npx vite build` — 0 errors. [PHASE4-SUMMARY:284]

## 18. Security Rules

- [ ] **18.1** `.env` files in `.gitignore` — never committed. [PRD.md:93-94, INITIAL_PROMPT:366-367]
- [ ] **18.2** Addis AI keys backend-only. [PRD.md:87]
- [ ] **18.3** Backend proxy for all Addis AI calls. [PRD.md:88]
- [ ] **18.4** httpOnly cookies for auth tokens; `secure` cookies in production. [PRD.md:92]
- [ ] **18.5** Rate limits on auth and AI endpoints. [PRD.md:90]
- [ ] **18.6` `helmet`, `cors`, `compression`, `cookie-parser`, `express-mongo-sanitize`, `express-rate-limit` applied globally. [PHASE2-SUMMARY:55, ARCHITECTURE.md:85]
- [ ] **18.7** Audio type and size validated server-side. Duration metadata stored as informational — not enforced as a hard limit. Long audio chunked by backend for STT. [PRD.md:91, ADR-005:30-31]
- [ ] **18.8** Safe logging: no passwords, tokens, raw cookies, secrets, raw audio, full transcription, or full generated reports. [INITIAL_PROMPT:315, PRD.md:83]
- [ ] **18.9** No secret keys in frontend code, Vite env sent to browser, localStorage, Redux state, or client logs. [INITIAL_PROMPT:81-82]

## 19. Data Model Rules

- [ ] **19.1** User: name, email, passwordHash, role, avatarUrl, phone, isActive, lastLoginAt, timestamps. [ARCHITECTURE.md:173]
- [ ] **19.2** Branch: name (enum from BRANCH_NAMES), code, branch, address, managerName, managerPhone, isActive, timestamps. [ARCHITECTURE.md:174]
- [ ] **19.3** Report: user, reportDate, branches[], status, languageMode, supervisorName (snapshot), notes, audioClips[], transcription, reviewedTranscription, generatedReport (text, modelVersion, promptVersion, finishReason, inputTokens, outputTokens, status), editedReport, exportHistory[] (format, exportedAt, filename), timestamps. [ARCHITECTURE.md:175]
- [ ] **19.4** AiGeneration (future): report, provider, model, promptVersion, inputSnapshot, output, usageMetadata, finishReason, status. [ARCHITECTURE.md:176]
- [ ] **19.5** No `title` field required at report creation — AI generates from audio content. [PHASE7-SUMMARY:8]

## 20. File Organization

- [ ] **20.1** Backend structure: `src/app.js`, `src/server.js`, `src/config/`, `src/controllers/`, `src/middleware/`, `src/models/`, `src/routes/`, `src/services/`, `src/utils/`, `src/validators/`. [ARCHITECTURE.md:19-75]
- [ ] **20.2** Client structure: `src/components/audio/`, `src/components/feedback/`, `src/components/layout/`, `src/components/reusable/`, `src/pages/`, `src/hooks/`, `src/providers/`, `src/routes/`, `src/services/`, `src/store/`, `src/theme/`, `src/utils/`. [ARCHITECTURE.md:103-141]
- [ ] **20.3** Theme files: `client/src/theme/themePrimitives.js`, `customizations/`, `AppTheme.jsx`. [ARCHITECTURE.md:198-200]

## 21. Cookie & Auth Token Rules

- [ ] **21.1** Access token cookie: `path=/api/v1`, 15m expiry. Refresh token cookie: `path=/api/v1/auth`, 7d expiry. [PHASE3-SUMMARY:139-141, ADR-002:13-14]
- [ ] **21.2** Both: `httpOnly: true`, `secure` in production (`COOKIE_SECURE`), `sameSite: lax` (`COOKIE_SAME_SITE`). [PHASE3-SUMMARY:142]
- [ ] **21.3** Frontend sends `credentials: 'include'` on all fetch calls via apiClient. [ADR-002:16]
- [ ] **21.4` `/auth/refresh` issues new access token and rotates refresh token transparently. [ADR-002:17]
- [ ] **21.5** Cookie options configured in `utils/cookieOptions.js` — not hardcoded in controllers. [PHASE3-SUMMARY:139]

## 22. Audio Recording (ADR-005)

- [ ] **22.1** No fixed duration limit — user records as long as needed within 10 MB file size constraint. [ADR-005:17-18]
- [ ] **22.2** 10 MB limit enforced client-side after recording stops. If `blob.size > 10 MB`: submit blocked, warning shown, user asked to re-record. [ADR-005:22-25]
- [ ] **22.3** Long recordings exceeding STT per-request duration (60s) are chunked by backend before STT. Frontend sends full blob as single upload. [ADR-005:30-31]
- [ ] **22.4** Audio blob: component-local state (`useState` + `useRef` in custom hook). NOT persisted to Redux, redux-persist, or localStorage. [ADR-005:34]
- [ ] **22.5** MIME type priority: `audio/webm;codecs=opus` → `audio/webm` → `audio/mp4` → browser default. [ADR-005:38-42]
- [ ] **22.6** Browser `MediaRecorder` API. [PHASE9:55]

## 23. JSDoc Conventions

- [ ] **23.1** Module-level: `@module path/name` at top of each file. [ARCHITECTURE.md:83]
- [ ] **23.2** Function-level: `@param {type} name - description`, `@returns {type}`, `@throws {ErrorType} reason` where applicable. [ARCHITECTURE.md:83]
- [ ] **23.3** Constants: `@type {TypeDefinition}` on exported constants. [PHASE1-6-VALIDATION:36]
- [ ] **23.4** Theme customizations: use `@module` not `@file`. [PHASE5-SUMMARY:20]
- [ ] **23.5` `AppTheme.jsx`: use `@module`. [AGENTS.md]
- [ ] **23.6** Express types: `import('express').Request`, `import('express').Response`, `import('express').NextFunction`. [CODE STANDARD]
- [ ] **23.7** Mongoose middleware types: `@returns {Promise<void>}` for async middleware. [CODE STANDARD]

## 24. Error Handling Patterns

- [ ] **24.1** Global error handler (4-param Express error handler): distinguishes operational `ApiError` from unexpected errors. [PHASE2-SUMMARY:61]
- [ ] **24.2** Error response shape: `{ success: false, message: "..." }`. In development, `stack` may be included. [PHASE2-SUMMARY:83-86]
- [ ] **24.3` `ApiError` class with `statusCode`, `message`, `isOperational` properties. [PHASE2-SUMMARY:84, APIERROR]
- [ ] **24.4** Error layer strategy: API errors → `rejectWithValue` in thunks → slice `error` state. React errors → `AppErrorBoundary`. Toast for non-blocking errors. [PHASE4-SUMMARY:254-259]
- [ ] **24.5** `notFound.middleware.js`: catches unmatched routes, creates `ApiError(404, ...)`, forwards via `next()`. [PHASE2-SUMMARY:60]
- [ ] **24.6** Validation errors: `validate.middleware.js` returns 422 with `{ success: false, errors: [{ path, msg }] }`. [PHASE3-SUMMARY:127]

## 25. Workspace & Build

- [ ] **25.1** Root `package.json` scripts: `install:all` (npm install in root + backend + client), `dev:backend` (nodemon), `dev:client` (vite). [PHASE1-SUMMARY:9]
- [ ] **25.2** Backend dev: `nodemon` for auto-restart. [PACKAGE_DECISIONS.md:29]
- [ ] **25.3** Client dev: `vite` dev server. [PACKAGE_DECISIONS.md:66]
- [ ] **25.4** Linter: `oxlint` (not ESLint). `.oxlintrc.json` with react rules. [PHASE4-SUMMARY:283]
- [ ] **25.5` `npm run` (not yarn or pnpm). [PHASE1-SUMMARY:70]

## 26. Phase 7 Audit Rules (All Violations Fixed)

- [ ] **26.1** `report.service.js` `generateMonthlyReport` must use dynamic `statusCounts` iterating all 7 actual statuses — NOT hardcoded COMPLETED/PENDING/ON_PROGRESS. [PHASE7-SUMMARY:100]
- [ ] **26.2` `GENERAL_RATE_LIMIT` constant in `constants.js` — `security.middleware.js` uses it (no hardcoded magic values). [PHASE7-SUMMARY:101]
- [ ] **26.3** No dead `REPORT.TITLE_*` constants — removed from `constants.js`. [PHASE7-SUMMARY:102]
- [ ] **26.4** Controllers must delegate to services — `profile.controller.js` calls `profile.service.js`, not `User` model directly. [PHASE7-SUMMARY:103]
- [ ] **26.5** No unused packages — `validator` removed from `backend/package.json`. [PHASE7-SUMMARY:104]
- [ ] **26.6** No unused imports — e.g., `bcrypt` removed from `mock/index.js`. [AUDIT]
- [ ] **26.7** No unused `env` import — e.g., `health.controller.js` only imports `env` if used. [AUDIT]
- [ ] **26.8** No unused exports — `OAuthAccount` model removed (dead code). [AUDIT]
- [ ] **26.9` `error.middleware.js` uses `apiResponse()` and `env.NODE_ENV` — not `res.status().json()` or `process.env`. [PHASE5-SUMMARY:61]
- [ ] **26.10** `validate.middleware.js` uses `apiResponse()` — not `res.status().json()`. [PHASE5-SUMMARY:62]

## 27. New File Creation Rules

- [ ] **27.1** ALWAYS prefer editing existing files — NEVER write new files unless explicitly required by a phase prompt. [INSTRUCTION]
- [ ] **27.2** When creating new files, understand existing code conventions first — mimic code style, use existing libraries, follow patterns. [INSTRUCTION]
- [ ] **27.3** Never create documentation files (*.md) or README files unless explicitly requested. [INSTRUCTION]
- [ ] **27.4** Never add code explanation summaries unless requested. After working on a file, just stop. [INSTRUCTION]

## 28. Validation & Audit Rules

- [ ] **28.1** Run `node --check` on all backend files after changes. [PHASE1-6-VALIDATION:39]
- [ ] **28.2** Run `npx vite build` on client after changes — 0 errors. [PHASE4-SUMMARY:284]
- [ ] **28.3** Check every file for unused imports, unused variables, unused parameters, missing JSDoc. [AUDIT]
- [ ] **28.4** No hardcoded magic values — everything in `constants.js` or config. [PHASE2-SUMMARY:74]
- [ ] **28.5** No deprecated MUI props — check all new components. [PHASE4-SUMMARY:135-138]
- [ ] **28.6** All responses use `apiResponse(res, statusCode, message, data?)` — never ad-hoc JSON shapes. [PHASE2-SUMMARY:78-82]
- [ ] **28.7** All operational errors use `throw new ApiError(statusCode, message)` — never raw throw. [PHASE2-SUMMARY:84]
- [ ] **28.8** HTTP status codes imported from `httpStatus` — never hardcoded. [PHASE2-SUMMARY:91]

## 29. Phase 8 Report Frontend Rules

- [ ] **29.1** MuiDatePicker must explicitly switch between `DesktopDatePicker` (md+, popper) and `MobileDatePicker` (<md, dialog) using `theme.breakpoints.up('md')` — never rely on DatePicker auto-switching. [PHASE8-SUMMARY, CLIENT:MuiDatePicker.jsx]
- [ ] **29.2** MuiSelect defaults `MenuProps={{ slotProps: { paper: { sx: { maxHeight: 300 } } } }}` for consistent dropdown height. [PHASE8-SUMMARY, CLIENT:MuiSelect.jsx]
- [ ] **29.3** MuiDialog defaults `disableEnforceFocus={true}` and `disableRestoreFocus={true}` to prevent focus-management issues in modal dialogs. [PHASE8-SUMMARY, CLIENT:MuiDialog.jsx]
- [ ] **29.4** MuiButton defaults `size="small"`. [PHASE8-SUMMARY, CLIENT:MuiButton.jsx]
- [ ] **29.5** MuiPageHeader accepts `sx` prop for outer Box overrides. [PHASE8-SUMMARY, CLIENT:MuiPageHeader.jsx]
- [ ] **29.6** MuiPagination defaults `color="primary"` and `shape="rounded"`. [PHASE8-SUMMARY, CLIENT:MuiPagination.jsx]
- [ ] **29.7** DataGrid action column icon colors use `sx` theme-path strings (`'primary.main'`, `'warning.main'`, `'error.main'`) — never the `color` prop on IconButton. [PHASE8-SUMMARY, CLIENT:ReportsDataGrid.jsx]
- [ ] **29.8** Tooltip children wrapping IconButton or other MUI elements must be wrapped in `<span>` for reliable event-handler attachment. [PHASE8-SUMMARY, CLIENT:ReportsDataGrid.jsx]
- [ ] **29.9** GlobalSearchDialog uses `react-hook-form` `useForm` with `register` for the search input (uncontrolled, no re-render on keystroke). Left arrow (ArrowBackIcon) start adornment clears field + resets results + closes dialog. [PHASE8-SUMMARY, CLIENT:GlobalSearchDialog.jsx]
- [ ] **29.10** ReportsFilterDialog handleClear must pass explicit empty filter defaults (status: '', branch: '', dateFrom: '', dateTo: '') and call onApply + onClose. [PHASE8-SUMMARY, CLIENT:ReportsFilterDialog.jsx]
- [ ] **29.11** ReportsPage uses MuiPagination for list view pagination. [PHASE8-SUMMARY, CLIENT:ReportsPage.jsx]
- [ ] **29.12** ReportsToolbar uses MuiPageHeader as outer container with action slot for filter/create/toggle buttons. [PHASE8-SUMMARY, CLIENT:ReportsToolbar.jsx]
- [ ] **29.13** ReportMetadataDialog uses MuiDatePicker via Controller (documented with code comment) and MuiTextField with `select multiple` for branch selection. [PHASE8-SUMMARY, CLIENT:ReportMetadataDialog.jsx]
- [ ] **29.14** ReportsFilterDialog uses MuiDatePicker for date fields. [PHASE8-SUMMARY, CLIENT:ReportsFilterDialog.jsx]
- [ ] **29.15** CreateReportPage must not pass `textAlign` as a DOM prop — place in `sx`. [PHASE8-SUMMARY, CLIENT:CreateReportPage.jsx]
- [ ] **29.16** MuiEmptyState and MuiErrorState use MuiButton (not raw Button) for action/retry buttons. [PHASE8-SUMMARY, CLIENT:MuiEmptyState.jsx, MuiErrorState.jsx]
- [ ] **29.17** ReportsDataGrid is wrapped with `withErrorBoundary` from react-error-boundary with a DataGridErrorFallback. [PHASE8-SUMMARY, CLIENT:ReportsDataGrid.jsx]
- [ ] **29.18** ReportsDataGrid action column uses Stack with `sx={{ alignItems: 'center', justifyContent: 'center' }}` for centered icon layout. [PHASE8-SUMMARY, CLIENT:ReportsDataGrid.jsx]
- [ ] **29.19** Always use MuiDialog (from reusable) instead of raw `@mui/material/Dialog` to inherit `disableEnforceFocus`/`disableRestoreFocus` defaults. [CLIENT:ReportsDataGrid.jsx, GlobalSearchDialog.jsx]
- [ ] **29.20** Always use MuiButton (from reusable) instead of raw `@mui/material/Button` to inherit `size="small"` default. [CLIENT:ReportsToolbar.jsx, LandingPage.jsx, NotFoundPage.jsx, etc.]
- [ ] **29.21** MuiCard always wraps children in CardContent — do NOT use MuiCard when the caller already provides CardContent or uses CardActions. Only use for simple card blocks where content is the direct child. [CLIENT:MuiCard.jsx]

---

*Last updated: 2026-07-11*
*Extracted from: ARCHITECTURE.md, PACKAGE_DECISIONS.md, DEVELOPMENT_PHASES.md, PRD.md, PROJECT_OVERVIEW.md, PROBLEM_STATEMENT.md, INITIAL_PROMPT, ADR-001 through ADR-006, ADR README, PHASE-1-SUMMARY through PHASE-12-SUMMARY, PHASE-1-4-VALIDATION, PHASE-1-6-VALIDATION, RESEARCH/addis-ai.md, RESEARCH/addis-ai-concrete-understanding.md, all 16 phase prompt files, phase 11 audit.*
