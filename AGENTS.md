# AGENTS.md — Report Builder V1

## Project State

Phases 1-5 complete. Phase 5 audit-driven fixes applied across backend and client. Backend all-clean: graceful shutdown includes mongoose disconnect, apiResponse used in error and validate middleware, env used from config (not process.env), ADDIS_AI_STT_MODEL added to env vars, GET /oauth/google route added with googleOAuth controller, JSDoc @type annotations on all middleware, logger uses centralized env. Client all-clean: AppThemeProvider created at client/src/providers/AppThemeProvider.jsx, JSDoc added to all 8 Phase 5 wrappers, LocalizationProvider with AdapterDayjs in main.jsx, MuiButton uses native MUI loading/loadingIndicator/loadingPosition props, ProtectedRoute passes state.from on redirect, API_CONFIG centralized in constants.js, theme customization files use @module instead of @file. All backend and client files pass syntax validation and builds.

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
- Commits: `feat: phase N description`
- Each phase merges into `main` after approval, then branch is deleted
- No direct commits to `main`

## Backend Conventions

- `express-async-handler` wraps all controllers → errors forwarded via `next(error)` (ADR-004)
- Write controllers use `try/catch/finally` with MongoDB sessions/transactions (register, updateProfile, changePassword)
- `authenticate` middleware extracts JWT from `req.cookies.accessToken` (httpOnly), verifies via `token.service`, attaches `req.user` (user doc without passwordHash)
- `authorize(...roles)` middleware checks `req.user.role` — returns 403 if not in allowed roles
- `mongoose-paginate-v2` for paginated list endpoints (default page: 1, limit: 10, max: 100)
- All constants in `backend/src/utils/constants.js` — no magic values
- All config via frozen `env` object from `backend/src/config/env.js` (20+ vars)
- `normalizeEmail({ gmail_remove_dots: false })` on auth validators (preserves Gmail plus/dot addressing)
- `express-validator` rules in `validators/*.js`, results checked via `validate.middleware.js` (422 on failure)
- httpOnly cookie options: access token scoped to `/api/v1` (15m), refresh token scoped to `/api/v1/auth` (7d) (ADR-002)
- OAuth-ready architecture with provider-neutral service stub (`oauth.service.js`); Google placeholder until credentials set
- JSDoc on all public modules, functions, controllers, services, models
- Safe logging — no passwords, tokens, raw cookies, or secrets in logs
- Standardized response: `apiResponse(res, statusCode, message, data?)` — never ad-hoc JSON shapes
- Standardized error: `throw new ApiError(statusCode, message)` — never raw throw
- HTTP status codes: import `httpStatus` — never hardcode numeric codes
- Route aggregation: all routes mounted in `routes/index.js`, registered via `app.use('/api/v1', indexRouter)`
- Graceful shutdown on SIGINT/SIGTERM — server closes → mongoose closes → exit
- Controllers delegate to services: controllers handle HTTP, services handle business logic/DB

## Frontend Conventions

- MUI tree-shaking imports: `import TextField from '@mui/material/TextField'`
- MUI Grid uses `size` prop, not `item` (e.g. `<Grid size={{ xs: 12, md: 6 }}>`)
- 12 reusable MUI wrappers in `client/src/components/reusable/`, prefixed `Mui`. Input wrappers use `forwardRef`: MuiTextField, MuiPasswordField, MuiButton, MuiCard, MuiSelect, MuiDatePicker, MuiDialog, MuiDataGrid. Presentation wrappers: MuiPageHeader, MuiEmptyState, MuiLoadingState, MuiErrorState.
- `react-hook-form` with `register` — no `watch` or `Controller` unless documented with a code comment
- UI English only; content (audio, transcription, reports, AI chat) can be Amharic/English/mixed
- `apiClient` uses `credentials: "include"` for cookie-based auth
- **No deprecated MUI props**: `margin="normal"` → `sx={{ mb: 2 }}`, `InputProps` → `slotProps.input`, `Box component="form"` → native `<form>`, `Box component="img"` → native `<img>`, `Link component="button"` → `Link slots={{ root: 'button' }}`
- **MuiPasswordField**: eye toggle via `useState`/`useCallback`, `onMouseDown` prevents focus loss, no layout shift; merges caller's `slotProps.input.endAdornment`
- **MuiButton**: uses MUI's native `loading`, `loadingIndicator`, and `loadingPosition` props — pass `<CircularProgress size={20} />` as `loadingIndicator` and `"center"` as `loadingPosition` for centered spinner
- **Layout pattern**: fixed chrome + scrollable content on ALL layouts (public AND protected). Outer `height: 100vh; overflow: hidden`, chrome fixed, content `overflow-y: auto`. Never scroll body/html.
- **401→refresh→retry in apiClient**: direct `fetch` for refresh (not apiClient, avoids circular dep); `SESSION_EXPIRED` on refresh failure dispatches `clearAuth`; login/register/refresh/logout excluded from 401 handling
- **StrictMode double-fetch is normal**: React `<StrictMode>` in `main.jsx` double-invokes effects in dev — `fetchCurrentUser` fires twice on refresh. Production fires once. Do NOT remove StrictMode.

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

## Key Environment Variables

Backend `.env` needs: `NODE_ENV`, `PORT` (4000), `CLIENT_ORIGIN`, `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `COOKIE_SECURE`, `COOKIE_SAME_SITE`, `ADDIS_AI_BASE_URL`, `ADDIS_AI_API_KEY`, `ADDIS_AI_TEXT_MODEL`, `ADDIS_AI_STT_MODEL`, `ADDIS_AI_DEFAULT_TARGET_LANGUAGE`, `ADDIS_AI_STT_LANGUAGE_CODE`, `ADDIS_AI_TIMEOUT_MS`, `OAUTH_GOOGLE_CLIENT_ID`, `OAUTH_GOOGLE_CLIENT_SECRET`, `OAUTH_GOOGLE_CALLBACK_URL`.

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
- `docs/phase-1-6-validation.md` — broader validation report covering phases 1-3
- `AGENTS.md` — this file (project state, conventions, protocol)
