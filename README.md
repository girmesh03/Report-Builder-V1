# Report Builder V1

MERN stack application for area supervisors to generate daily Amharic branch-visit reports from recorded audio via Addis AI.

**Core workflow:** audio recording → transcription → AI report generation → export.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, Mongoose (ES Modules) |
| Frontend | React 19 + Vite 8, MUI 9, Redux Toolkit, React Router 8, React Hook Form |
| Auth | JWT (access 15m, refresh 7d) in httpOnly cookies |
| Database | MongoDB (`mongodb://127.0.0.1:27017/report-builder-v1`) |
| AI | Addis AI (backend-only proxy) |
| Language | JavaScript only |

## Local Setup

1. Clone the repo.
2. Ensure `backend/.env` exists with all required variables (see file for reference).
3. Ensure `client/.env` exists with all required variables (see file for reference).
4. Run `npm run install:all` to install backend and client dependencies.
5. Ensure MongoDB is running on `localhost:27017`.
6. Run `npm run dev:backend` (port 4000) and `npm run dev:client` (port 3000).

## Mock Data

```bash
node backend/mock/index.js --inject   # Seed 2 supervisors, 14 branches, 11 reports
node backend/mock/index.js --wipe     # Drop all collections (development only)
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/health` | No | Basic health check |
| GET | `/api/v1/health/db` | No | Database connectivity |
| POST | `/api/v1/auth/register` | No | Register new user |
| POST | `/api/v1/auth/login` | No | Login |
| POST | `/api/v1/auth/logout` | No | Clear auth cookies |
| POST | `/api/v1/auth/refresh` | No | Rotate tokens |
| GET | `/api/v1/auth/me` | Yes | Current user profile |
| GET | `/api/v1/auth/oauth/providers` | No | List OAuth providers |
| GET | `/api/v1/auth/oauth/google` | No | Google OAuth redirect |
| GET | `/api/v1/profile` | Yes | Get profile |
| PATCH | `/api/v1/profile` | Yes | Update name/phone/avatar |
| PATCH | `/api/v1/profile/password` | Yes | Change password |
| GET | `/api/v1/branches` | Yes | List branches (paginated) |
| GET | `/api/v1/branches/:id` | Yes | Get branch |
| POST | `/api/v1/branches` | Yes | Create branch |
| PATCH | `/api/v1/branches/:id` | Yes | Update branch |
| DELETE | `/api/v1/branches/:id` | Yes | Deactivate branch |
| GET | `/api/v1/reports` | Yes | List reports (paginated) |
| GET | `/api/v1/reports/monthly` | Yes | Monthly compilation |
| GET | `/api/v1/reports/export` | Yes | Date-range export |
| GET | `/api/v1/reports/:id` | Yes | Get report |
| POST | `/api/v1/reports` | Yes | Create draft report |
| PATCH | `/api/v1/reports/:id` | Yes | Update report |
| DELETE | `/api/v1/reports/:id` | Yes | Delete draft only |

## Frontend Routes

| Path | Page | Access |
|---|---|---|
| `/` | Landing page (hero + CTAs) | Public |
| `/login` | Login form (MuiCard, email/password, OAuth section) | Public (PublicRoute guard — redirects to /dashboard if authenticated) |
| `/register` | Registration form (MuiCard, name/email/password) | Public (PublicRoute guard — redirects to /dashboard if authenticated) |
| `/oauth/callback` | OAuth redirect handler | Public (PublicRoute guard — redirects to /dashboard if authenticated) |
| `/dashboard` | Dashboard (via ProtectedRoute) | Authenticated |
| `/reports` | Reports list/grid (via ProtectedRoute) — cards or Data Grid view, search, filters, pagination, create dialog | Authenticated |
| `/reports/:id` | Create report scaffold (via ProtectedRoute) — metadata summary, audio recording coming in Phase 9 | Authenticated |
| `/profile` | Profile page (via ProtectedRoute) | Authenticated |
| `*` | 404 page (SVG + navigation) | Public |

## Development Phases

The project follows 16 development phases, each on a feature branch (`phase-N-description`). Every phase requires explicit user approval before merging to `main`. See `docs/DEVELOPMENT_PHASES.md`.

**Status:** Phases 1–8 complete. Phase 7 built branch/report CRUD, mock data system, monthly/export endpoints. Phase 8 built reports list/grid frontend (card + Data Grid views), ReportsToolbar with MuiPageHeader, filter dialog, create report dialog, server-side pagination via MuiPagination, GlobalSearchDialog, post-build hardening (MuiDatePicker breakpoint switching, MuiSelect max-height, MuiDialog focus props, icon-only DataGrid actions with sx theme colors). Audit-driven fixes applied across backend (unused imports, JSDoc compliance, controller delegation, dead code removal).

## Validation

All project rules, conventions, and decisions are consolidated in [`docs/RULES.md`](./docs/RULES.md) for cross-phase validation.
