# AGENTS.md — Report Builder V1

## Core Identity

MERN stack for area supervisors generating daily Amharic branch-visit reports from recorded audio via Addis AI. The core workflow is **record audio → transcribe → generate AI report → preview/edit → finalize/export**. CRUD/dashboard/auth are supporting features.

## Stack (Do Not Change)

| Layer | Choice |
|---|---|
| Backend | Node.js, Express, Mongoose, **ES Modules only** |
| Frontend | React 19 + Vite 8, MUI 9, Redux Toolkit, React Router 8, React Hook Form |
| Auth | JWT (access 15m, refresh 7d) in httpOnly cookies |
| DB | MongoDB `mongodb://127.0.0.1:27017/report-builder-v1` |
| AI | Addis AI backend-only proxy (no client-side keys) |
| Lang | **JavaScript only** — no TS, no Next.js, no Tailwind |

## Quick Start

```bash
npm run install:all     # install both backend + client deps
npm run dev:backend     # port 4000 (nodemon)
npm run dev:client      # port 3000 (vite)
node backend/mock/index.js --inject   # seed 2 supervisors + 14 branches + 11 reports
```

MongoDB must be running on `localhost:27017`. Both `.env` files must exist (see `backend/.env` and `client/.env`).

## Report Status Pipeline

```
draft → audio_recorded → transcribed → transcription_reviewed → generated → finalized → exported
```

Each status transition is enforced server-side. Navigation logic in the reports list:
- `generated`/`finalized`/`exported` → links to `/reports/:id/preview`
- all other statuses → links to `/reports/:id` (create/edit flow)

## Backend — What to Know

- **Entrypoints**: `backend/src/server.js` (HTTP + graceful shutdown), `backend/src/app.js` (Express setup)
- **All controllers** wrapped with `express-async-handler` — errors flow to `next(error)`
- **Write controllers** use `try/catch/finally` with MongoDB sessions (startSession → startTransaction → commit/abort → endSession)
- **Exceptions**: `transcription.controller.js` and `reportGeneration.controller.js` avoid long-held transactions because AI calls take 30-60s+. The generation controller commits the transaction BEFORE the external AI call.
- **All config** via frozen `env` object from `backend/src/config/env.js` — never `process.env`
- **All constants** in `backend/src/utils/constants.js` — no magic values
- **HTTP codes** from `utils/httpStatus.js` — never hardcoded numbers
- **Responses**: `apiResponse(res, status, message, data?)` and `throw new ApiError(status, message)` — no ad-hoc JSON
- **Auth**: `authenticate` middleware extracts JWT from `req.cookies.accessToken`, attaches `req.user` (without `passwordHash`). Always use `req.user._id.toString()` (not `req.user.id`).
- **Pagination**: `mongoose-paginate-v2` on branches/reports — default page 1, limit 10, max 100
- **Cookie scope**: access token → `/api/v1` (15m), refresh token → `/api/v1/auth` (7d)
- **Auth rate limit**: 20 req/15min on register + login only (`authLimiter`)
- **No unused imports** — every import must be referenced
- **Unused params** prefixed with `_` (e.g., `_req`, `_res`, `_next`)
- **JSDoc** on all modules (`@module`), functions (`@param`, `@returns`, `@throws`)
- **Validators** in `validators/*.js`, checked via `validate.middleware.js` (422 on failure). `normalizeEmail({ gmail_remove_dots: false })` on auth.
- **Controllers delegate to services** — controllers handle HTTP, services handle business logic/DB
- **Routes** aggregated in `routes/index.js`, mounted at `/api/v1`
- **Audio upload**: stored via Multer at `backend/uploads/audio/`. 10 MB limit, allowed MIME types in `fileValidation.js`.
- **Chunking for STT**: `audioChunker.js` does full-file ffmpeg → WAV → PCM-level split. **CRITICAL:** after conversion, detect WAV by RIFF header (`0x52 0x49 0x46 0x46`), set MIME to `audio/wav`. Using the original `audio/webm` type garbles transcription.
- **Auto-seed**: 14 predefined Amharic branches seeded on first startup by `config/seedBranches.js` (idempotent — only seeds if collection empty)
- **Mock data**: `node backend/mock/index.js --inject` (seeds) / `--wipe` (drops). Dev-only.

## Frontend — What to Know

- **Entrypoints**: `client/src/main.jsx` (router + Redux + provider), `client/src/App.jsx` (theme, error boundary, `fetchCurrentUser` on mount)
- **13 MUI wrappers** in `components/reusable/` prefixed `Mui`. **Prefer these** over raw MUI. Input wrappers use `forwardRef`. Exceptions: MuiCard auto-wraps in CardContent.
- **`react-hook-form` with `register`** only — no `watch` or `Controller` unless documented with code comment
- **MUI Grid** uses `size` prop: `<Grid size={{ xs: 12, md: 6 }}>` (not `item`/`xs`/`md`)
- **No deprecated MUI props**: `margin="normal"` → `sx={{ mb: 2 }}`, `InputProps` → `slotProps.input`, `Box component="form"` → `<form>`, `Link component="button"` → `Link slots={{ root: 'button' }}`
- **IconButton colors**: use `sx` theme-path strings (`'primary.main'`, `'warning.main'`, `'error.main'`), never `color` prop
- **Tooltip wrapping**: always wrap IconButton children in `<span>` for reliable event handlers
- **Layout**: ALL layout wrappers use `height: 100vh; overflow: hidden` outer, fixed chrome, `overflow-y: auto` content. Never scroll `<body>`/`<html>`.
- **401→refresh→retry** in `apiClient.js`: direct `fetch` for refresh (avoids circular dep). Login/register/refresh/logout excluded from 401 handling. `SESSION_EXPIRED` dispatches `clearAuth`.
- **Audio upload** uses **direct `fetch`** (not `apiClient`) in `services/audioApi.js` because it sends `FormData` (multipart). `apiClient` hardcodes `Content-Type: application/json` which breaks multipart.
- **StrictMode double-fetch**: `fetchCurrentUser` fires twice in dev. Normal. Do NOT remove `<StrictMode>`.
- **Lint**: `client/.oxlintrc.json` — run `oxlint` (not eslint)
- **Store**: 4 slices — `auth`, `profile`, `reports`, `branches`. No `redux-persist` config in store (it's imported in package.json but unused).
- **Reusable components in depth**: `components/reports/` has 14 report-specific components; `components/audio/` has 5 audio components
- **MuiButton defaults**: `size="small"`, native `loading`/`loadingIndicator`/`loadingPosition` props. Pass `<CircularProgress size={20} />` as `loadingIndicator` and `"center"` as `loadingPosition`.

## AI Integration

- **STT**: `POST /api/v2/stt` (multipart, max 60s/10MB per chunk, WAV recommended)
- **Text generation**: `POST /api/v1/chat_generate` (JSON, temperature 0.2, model `Addis-፩-አሌፍ`)
- **All AI calls** go through `services/ai/addisAi.client.js` (native fetch, timeout, error mapping via `aiProviderErrors.js`)
- **Prompt**: built by `reportPrompt.service.js` with 18+ Amharic rules (word selection, self-check, format rules)
- **API keys** (`sk_*`) must never appear in client code, Vite env vars, or logs

## Important File Map

| Purpose | Files |
|---|---|
| Backend entry | `backend/src/server.js`, `backend/src/app.js` |
| Route hub | `backend/src/routes/index.js` |
| Models | `backend/src/models/{user,branch,report}.model.js` |
| Reusable client wrappers | `client/src/components/reusable/Mui*.jsx` (13 files) |
| API services | `client/src/services/{apiClient,auth,profile,reports,branches,audio,transcription,reportGeneration,reportPreview}Api.js` |
| Redux | `client/src/store/{auth,profile,reports,branches}Slice.js` |
| Layout | `client/src/components/layout/{AppShell,AppSidebar,AppTopbar,PublicLayout,PublicAppBar}.jsx` |
| AI proxy | `backend/src/services/ai/{addisAi.client,addisAiStt.service,addisAiText.service,audioChunker,wavSplitter}.js` |
| Theme | `client/src/theme/{AppTheme,themePrimitives}.jsx` and `customizations/` |
| Consolidated rules | `docs/RULES.md` (~280 rules, 28 categories) |
| Architecture | `docs/ARCHITECTURE.md` |

## Development Protocol (Mandated by prior phases)

Each phase follows **6 steps in order**: (1) `git status`, create `phase-N-description` branch → (2) deep codebase analysis → (3) review prior phases → (4) implement → (5) **wait for explicit user approval** → (6) stage/commit/push/merge/delete branch. **Never skip step 5.**

Commit messages: `feat: phase N description` or `chore: phase N description` for hardening.

## Source of Truth

- `docs/RULES.md` — 280+ consolidated rules
- `docs/ARCHITECTURE.md` — full directory structure and patterns
- `docs/DEVELOPMENT_PHASES.md` — 16-phase roadmap (phases 14-16 not yet built)
- `docs/decisions/ADR-*.md` — architectural decision records
- `docs/phases/phase-*.md` — per-phase implementation records
