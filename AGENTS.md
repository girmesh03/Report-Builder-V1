# AGENTS.md — Report Builder V1

## Project State

Phases 1-8 complete. Phase 5 audit-driven fixes applied across backend and client. Phase 7 audit fixed 5 critical violations. Post-audit cleanup resolved 21+ additional violations across 9+ files.

**Backend all-clean:** graceful shutdown includes mongoose disconnect, apiResponse used in error and validate middleware, env used from config (not process.env), ADDIS_AI_STT_MODEL added to env vars, GET /oauth/google route added with googleOAuth controller, JSDoc @type annotations on all middleware, logger uses centralized env, no unused imports (bcrypt removed from mock/index.js), no unused parameters (all unused params prefixed with `_`), no dead code (oauthAccount.model.js removed, logger.debug removed, validator package removed), all JSDoc `@param`/`@returns`/`@throws` complete on all controllers/services. `GENERAL_RATE_LIMIT` constant added. Profile controller delegates to profile.service.js. backend/mock/index.js uses `ordered: true` for Report.create batch. All 31 backend source files pass `node --check`.

**Client all-clean:** AppThemeProvider created at client/src/providers/AppThemeProvider.jsx, JSDoc added to all 8 Phase 5 wrappers, LocalizationProvider with AdapterDayjs in main.jsx, MuiButton uses native MUI loading/loadingIndicator/loadingPosition props, ProtectedRoute passes state.from on redirect, API_CONFIG centralized in constants.js, theme customization files use @module instead of @file, AppTheme.jsx uses @module. All 48+ client files pass build.

Phase 8 built: ReportsPage with list view (card grid, responsive `xs:12 sm:6 md:4`) and grid view (MuiDataGrid with server-side pagination). ReportsToolbar with search (debounced 400ms), status filter, date from/to pickers, list/grid toggle, create button. ReportMetadataDialog (react-hook-form, native date input, native multi-branch select, notes). CreateReportPage scaffold at `/reports/:id` (metadata summary, audio placeholder for Phase 9). reportsApi/branchesApi services. reportsSlice/branchesSlice Redux reducers. MuiErrorState.jsx icon fixed (`ErrorOutline` → `ErrorOutlineRoundedIcon`). All 48+ client files build with 0 errors.

Phase 11 built: Addis AI STT integration — `addisAi.client.js`, `addisAiStt.service.js`, `aiProviderErrors.js`, `transcription.controller.js`, `transcription.routes.js`, `transcription.validators.js`, `audioChunker.js`, `wavSplitter.js`, `transcriptionApi.js`, `TranscriptionPanel.jsx`. **Accuracy-critical:** The chunking pipeline uses ffmpeg full-file WAV conversion → PCM-level split (avoids per-segment Opus re-encoding artifacts). Each chunk blob's MIME type is set to `audio/wav` by detecting the `RIFF` header — using the original `audio/webm` type causes garbled transcription. Re-transcription is available (backend accepts `audio_recorded` AND `transcribed` statuses; frontend shows "Re-transcribe" button). Auto-seed of 14 predefined branches on first startup (`config/seedBranches.js`). See RULES.md rules 13.21-13.25 for the 5 accuracy rules. Backend 53+ source files pass `node --check`; client 48+ files build with 0 errors.

Phase 6 built: AppShell (responsive sidebar with logout at bottom + Divider, top bar with dynamic page title + user menu, scrollable content area), DashboardPage (summary stat cards + recent activity placeholder), ProfilePage (two-column: personal info form + change password form, react-hook-form with register, Mui wrappers, MuiPageHeader, MuiButton with native loading), ReportsPlaceholderPage replaced by ReportsPage, profileApi/profileSlice (fetchProfile, updateProfile, changePassword), PublicRoute guard (inverse — redirects authenticated users from public auth pages to /dashboard), PublicAppBar logo navigates to /dashboard if authenticated else / with theme toggle. GlobalSearchDialog in AppTopbar with search + theme toggle. AppShell collapsible sidebar support.

Phase 7 built: Branch model (name enum from BRANCH_NAMES constant — 14 predefined Amharic names) + Report model with embedded schemas (audioClips, transcription, generatedReport, exportHistory), mongoose-paginate-v2, CRUD services/controllers/routes/validators, owner-scoped report access, backend/mock/index.js (--inject seeds 2 supervisors + 14 branches + 11 reports; --wipe drops all collections; both use MongoDB sessions). Branch schema field renamed from `area` to `branch`. Added `GET /api/v1/reports/monthly?year=&month=` for monthly compilation (dynamic statusCounts) and `GET /api/v1/reports/export?dateFrom=&dateTo=` for date-range export. `TASK_STATUS` constant (PENDING/ON_PROGRESS/COMPLETED) added to constants.js for future task-level status system. `GENERAL_RATE_LIMIT` constant added.

Consolidated validation document created at `docs/RULES.md` — 28 categories, ~280 rules extracted from every line of every document in `docs/`.

## Core Identity

MERN stack app for area supervisors to generate daily Amharic branch-visit reports from recorded audio via Addis AI. The core workflow: **audio recording → transcription → AI report generation → export**. CRUD/dashboard/auth are supporting features, not the product.

## Stack (Pre-decided, Do Not Change)

| Layer | Choice |
|---|---|
| Backend | Node.js, Express, Mongoose, **ES Modules only** |
| Frontend | React 19 + Vite 8, MUI 9, Redux Toolkit, React Router 8, React Hook Form |
| Auth | JWT (access 15m, refresh 7d) in httpOnly cookies |
| DB | MongoDB (`mongodb://127.0.0.1:27017/report-builder-v1`); Atlas with replica set for transactions |
| AI | Addis AI backend proxy only (no client-side keys) |
| Language | **JavaScript only** — no TypeScript, no Next.js, no Tailwind |

## Development Protocol (Mandatory)

Each phase follows **exactly 6 steps in order**:

1. **Pre-Git** — `git status`, create feature branch (`phase-N-description`)
2. **Deep codebase analysis** — understand everything existing
3. **Analyze all prior phases** — review previous work
4. **Phase execution** — implement without deviation
5. **User review & feedback** — present changes, wait for **explicit approval**
6. **Post-Git** — stage, commit, push, merge, delete feature branch (only after approval)

**Never skip Step 5. Never proceed to Step 6 without explicit user approval.**

## Git Conventions

- Feature branches: `phase-N-description` (e.g. `phase-3-authentication-profile-api`)
- Commits: `feat: phase N description`, `chore: phase N description` for hardening
- Each phase merges into `main` after approval, then branch is deleted
- No direct commits to `main`

## Backend Conventions

- `express-async-handler` wraps all controllers → errors forwarded via `next(error)` (ADR-004)
- Write controllers use `try/catch/finally` with MongoDB sessions/transactions (register, updateProfile, changePassword, createReport, updateReport, deleteReport, createBranch, updateBranch, deactivateBranch)
- `authenticate` middleware extracts JWT from `req.cookies.accessToken` (httpOnly), verifies via `token.service`, attaches `req.user` (user doc without passwordHash)
- `authorize(...roles)` middleware checks `req.user.role` — returns 403 if not in allowed roles
- `mongoose-paginate-v2` for paginated list endpoints (default page: 1, limit: 10, max: 100)
- All constants in `backend/src/utils/constants.js` — no magic values
- All config via frozen `env` object from `backend/src/config/env.js` (20+ vars)
- `normalizeEmail({ gmail_remove_dots: false })` on auth validators (preserves Gmail plus/dot addressing)
- `express-validator` rules in `validators/*.js`, results checked via `validate.middleware.js` (422 on failure)
- httpOnly cookie options: access token scoped to `/api/v1` (15m), refresh token scoped to `/api/v1/auth` (7d) (ADR-002)
- OAuth-ready architecture with provider-neutral service stub (`oauth.service.js`); Google placeholder until credentials set
- JSDoc on all public modules, functions, controllers, services, models — `@param`, `@returns`, `@throws` where applicable
- Safe logging — no passwords, tokens, raw cookies, or secrets in logs
- Standardized response: `apiResponse(res, statusCode, message, data?)` — never ad-hoc JSON shapes
- Standardized error: `throw new ApiError(statusCode, message)` — never raw throw
- HTTP status codes: import `httpStatus` — never hardcode numeric codes
- Route aggregation: all routes mounted in `routes/index.js`, registered via `app.use('/api/v1', indexRouter)`
- Graceful shutdown on SIGINT/SIGTERM — server closes → mongoose closes → exit
- Controllers delegate to services: controllers handle HTTP, services handle business logic/DB
- Unused parameters prefixed with `_` (e.g., `_req`, `_res`, `_next`)
- No unused imports — every import must be referenced in file body

## Frontend Conventions

- MUI tree-shaking imports: `import TextField from '@mui/material/TextField'`
- MUI Grid uses `size` prop, not `item` (e.g. `<Grid size={{ xs: 12, md: 6 }}>`)
- 13 reusable MUI wrappers in `client/src/components/reusable/`, prefixed `Mui`. Input wrappers use `forwardRef`: MuiTextField, MuiPasswordField, MuiButton, MuiCard, MuiSelect, MuiDatePicker, MuiDialog, MuiDataGrid, MuiPagination. Presentation wrappers: MuiPageHeader, MuiEmptyState, MuiLoadingState, MuiErrorState.
- MuiDatePicker explicitly switches between `DesktopDatePicker` (popper on md+) and `MobileDatePicker` (dialog on <md) via `theme.breakpoints.up('md')`.
- MuiSelect defaults `MenuProps.slotProps.paper.sx.maxHeight: 300`.
- MuiDialog defaults `disableEnforceFocus` and `disableRestoreFocus` to `true`.
- MuiButton defaults `size="small"`.
- MuiPageHeader accepts `sx` prop for outer Box overrides.
- **Prefer Mui wrappers over raw MUI**: always use MuiButton, MuiDialog, MuiTextField, MuiPasswordField, MuiSelect, MuiDatePicker, MuiDataGrid, MuiPagination, MuiCard over their raw MUI counterparts. Exceptions: MuiCard cannot replace `<Card> + <CardContent>` pattern (MuiCard auto-wraps children in CardContent). Use `import Component from '@mui/material/Component'` only when no reusable wrapper exists.
- `react-hook-form` with `register` — no `watch` or `Controller` unless documented with a code comment
- UI English only; content (audio, transcription, reports, AI chat) can be Amharic/English/mixed
- `apiClient` uses `credentials: "include"` for cookie-based auth
- **No deprecated MUI props**: `margin="normal"` → `sx={{ mb: 2 }}`, `InputProps` → `slotProps.input`, `Box component="form"` → native `<form>`, `Box component="img"` → native `<img>`, `Link component="button"` → `Link slots={{ root: 'button' }}`
- **MuiPasswordField**: eye toggle via `useState`/`useCallback`, `onMouseDown` prevents focus loss, no layout shift; merges caller's `slotProps.input.endAdornment`
- **MuiButton**: uses MUI's native `loading`, `loadingIndicator`, and `loadingPosition` props — pass `<CircularProgress size={20} />` as `loadingIndicator` and `"center"` as `loadingPosition` for centered spinner
- **Layout pattern**: fixed chrome + scrollable content on ALL layouts (public AND protected). Outer `height: 100vh; overflow: hidden`, chrome fixed, content `overflow-y: auto`. Never scroll body/html.
- **PublicRoute guard**: inverse of ProtectedRoute — redirects authenticated users to `/dashboard`. Wraps login, register, and oauth/callback pages. Adding future public pages requires only nesting inside `<PublicRoute>`.
- **PublicAppBar logo navigation**: reads `isAuthenticated` from Redux; click navigates to `/dashboard` if authenticated, else `/`.
- **AppSidebar**: responsive permanent Drawer (md+, collapsible) + temporary Drawer (mobile, centered app name). Navigation items with Logout at bottom separated by Divider via `justifyContent: 'space-between'`.
- **AppTopbar**: dynamic page title, search icon (opens GlobalSearchDialog), theme toggle (light/dark via `useColorScheme`), user avatar dropdown with profile + logout.
- **GlobalSearchDialog**: fullScreen on mobile, dialog on tablet+. react-hook-form `useForm` for uncontrolled input. Left arrow (ArrowBackIcon) start adornment clears field + resets results + closes dialog. Results grouped by report/branch via Accordion. Circular search-off icon for no-results state.
- **IconButton action colors in DataGrid**: use `sx` theme-path strings (`'primary.main'`, `'warning.main'`, `'error.main'`) per RULES.md rule 8.5. Never hardcoded hex or rgb values.
- **Tooltip wrapping**: always wrap child with `<span>` for reliable event-handler attachment when child is IconButton or other MUI element.
- **401→refresh→retry in apiClient**: direct `fetch` for refresh (not apiClient, avoids circular dep); `SESSION_EXPIRED` on refresh failure dispatches `clearAuth`; login/register/refresh/logout excluded from 401 handling
- **StrictMode double-fetch is normal**: React `<StrictMode>` in `main.jsx` double-invokes effects in dev — `fetchCurrentUser` fires twice on refresh. Production fires once. Do NOT remove StrictMode.
- **Theme-aware `sx`**: use `color: 'text.secondary'`, `bgcolor: 'background.paper'`, `color: 'primary.main'`, `color: 'warning.main'`, `color: 'error.main'` — never import from `themePrimitives.js` directly in components.

## Critical Package Decisions

| Decision | Reason |
|---|---|
| `bcryptjs` over `bcrypt` | bcrypt requires native compilation (fails on Windows without VS Build Tools). bcryptjs is pure-JS, identical API. (ADR-001) |
| `express-async-handler` over custom wrapper | Package already installed, 0 dependencies, identical API. One less file to maintain. (ADR-004) |
| No `.env.example` files | `.env` is gitignored, contains placeholder values as local reference. Real secrets never enter version control. (ADR-006) |
| No `cookie` package | No server-side cookie manipulation needed beyond `cookie-parser` |
| No frontend `dotenv` | Vite already loads `VITE_`-prefixed env vars |
| Native `fetch` (no axios) | Sufficient for both backend and frontend |
| No automated tests | Explicitly excluded from initial scope |
| `validator` package removed | Never imported anywhere in backend source |

## Key Environment Variables

Backend `.env` needs: `NODE_ENV`, `PORT` (4000), `CLIENT_ORIGIN`, `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `COOKIE_SECURE`, `COOKIE_SAME_SITE`, `ADDIS_AI_BASE_URL`, `ADDIS_AI_API_KEY`, `ADDIS_AI_TEXT_MODEL`, `ADDIS_AI_STT_MODEL`, `ADDIS_AI_DEFAULT_TARGET_LANGUAGE`, `ADDIS_AI_STT_LANGUAGE_CODE`, `ADDIS_AI_TIMEOUT_MS`, `FFMPEG_PATH`, `FFPROBE_PATH`, `OAUTH_GOOGLE_CLIENT_ID`, `OAUTH_GOOGLE_CLIENT_SECRET`, `OAUTH_GOOGLE_CALLBACK_URL`.

Client `.env` needs: `VITE_API_BASE_URL`, `VITE_APP_NAME`.

Addis AI API keys (`sk_*`) must never appear in client code, Vite env vars sent to browser, or logs.

## Addis AI Integration

- STT: `POST https://api.addisassistant.com/api/v2/stt` (multipart/form-data, max 60s/10MB, WAV recommended)
- Text generation: `POST https://api.addisassistant.com/api/v1/chat_generate` (JSON, use temperature 0.2 for reports)
- Backend-only proxy — no direct client-to-AddisAI calls
- Model: `Addis-፩-አሌፍ`

## Source of Truth

- `docs/ARCHITECTURE.md` — directory structure, data models, patterns
- `docs/PACKAGE_DECISIONS.md` — full package list with rationale
- `docs/decisions/ADR-*.md` — architectural decision records
- `docs/DEVELOPMENT_PHASES.md` — 16-phase roadmap
- `docs/PROBLEM_STATEMENT.md` — detailed product requirements and AI prompt design
- `docs/prompts/initial-one-time-prompt.md` — full specification (source of truth for all conventions above)
- `docs/phases/phase-1-summary.md` through `docs/phases/phase-16-summary.md` — per-phase implementation records
- `docs/phase-1-4-validation.md` — validated alignment between docs and implemented code for phases 1-4
- `docs/phase-1-6-validation.md` — validation report covering phases 1-6 (backend + client alignment audit)
- `docs/phases/phase-7-summary.md` — Phase 7 implementation record (branch/report models, CRUD, mock data, monthly report, export)
- `docs/phases/phase-8-summary.md` — Phase 8 implementation record (reports list/grid frontend, search/filter, create report dialog, pagination, post-build hardening)
- **`docs/RULES.md`** — consolidated rulebook (~280 rules across 28 categories, extracted from every line of every document)
- `AGENTS.md` — this file (project state, conventions, protocol)
