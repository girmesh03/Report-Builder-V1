# AGENTS.md — Report Builder V1

## Project State

Greenfield — no code written yet. Only `docs/` files staged for first commit. No `package.json`, `.gitignore`, or `.env` files exist.

## Core Identity

MERN stack app for area supervisors to generate daily Amharic branch-visit reports from recorded audio via Addis AI. The core workflow: **audio recording → transcription → AI report generation → export**. CRUD/dashboard/auth are supporting features, not the product.

## Stack (Pre-decided, Do Not Change)

| Layer | Choice |
|---|---|
| Backend | Node.js, Express, Mongoose, **ES Modules only** |
| Frontend | React 18 + Vite, MUI 6, Redux Toolkit, React Router 7, React Hook Form |
| Auth | JWT (access 15m, refresh 7d) in httpOnly cookies |
| DB | MongoDB local (`mongodb://127.0.0.1:27017/report-builder-v1`) |
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

- Feature branches: `phase-N-description` (e.g. `phase-2-backend-foundation`)
- Commits: `feat: phase N description`
- Each phase merges into `main` after approval, then branch is deleted
- No direct commits to `main`

## Backend Conventions

- `express-async-handler` wraps all controllers → errors forwarded via `next(error)`
- Write controllers use `try/catch/finally` with MongoDB sessions
- `mongoose-paginate-v2` for paginated list endpoints (default page: 1, limit: 10, max: 100)
- All constants in `backend/src/utils/constants.js` — no magic values
- All config via frozen `env` object from `backend/src/config/env.js`
- `normalizeEmail({ gmail_remove_dots: false })` on auth validators (preserves Gmail plus/dot addressing)
- JSDoc on all public modules, functions, controllers, services, models
- Safe logging — no raw audio, transcription, or reports in production logs

## Frontend Conventions

- MUI tree-shaking imports: `import TextField from '@mui/material/TextField'`
- MUI Grid uses `size` prop, not `item` (e.g. `<Grid size={{ xs: 12, md: 6 }}>`)
- Reusable MUI wrappers in `client/src/components/reusable/`, prefixed `Mui` (e.g. `MuiTextField.jsx`), wrapped with `forwardRef`
- `react-hook-form` with `register` — no `watch` or `Controller` unless documented with a code comment
- UI English only; content (audio, transcription, reports, AI chat) can be Amharic/English/mixed
- `apiClient` uses `credentials: "include"` for cookie-based auth

## Critical Package Decisions

| Decision | Reason |
|---|---|
| `bcryptjs` over `bcrypt` | bcrypt requires native compilation (fails on Windows without VS Build Tools). bcryptjs is pure-JS, identical API. |
| No `cookie` package | No server-side cookie manipulation needed beyond `cookie-parser` |
| No frontend `dotenv` | Vite already loads `VITE_`-prefixed env vars |
| Native `fetch` (no axios) | Sufficient for both backend and frontend |
| No automated tests | Explicitly excluded from initial scope |

## Key Environment Variables

Backend `.env` needs: `NODE_ENV`, `PORT` (4000), `CLIENT_ORIGIN`, `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `ADDIS_AI_BASE_URL`, `ADDIS_AI_API_KEY`, `ADDIS_AI_TEXT_MODEL`, `ADDIS_AI_STT_LANGUAGE_CODE`.

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
- `docs/phase-1-6-validation.md` — validated alignment between docs and implemented code for phases 1-6
