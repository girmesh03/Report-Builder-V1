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

## Development Phases

The project follows 16 development phases, each on a feature branch (`phase-N-description`). Every phase requires explicit user approval before merging to `main`. See `docs/DEVELOPMENT_PHASES.md`.
