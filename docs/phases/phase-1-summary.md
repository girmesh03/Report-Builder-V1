# Phase 1 Summary — Repository Foundation And Documentation

## Created Files

| File | Purpose |
|---|---|
| `.gitignore` | Ignore node_modules, .env, dist, build, logs |
| `README.md` | Product purpose, tech stack, local setup, phase workflow |
| `package.json` | Root workspace scripts (install:all, dev:backend, dev:client) |
| `backend/package.json` | Backend dependencies (ES modules, Express, Mongoose, JWT, bcryptjs, etc.) |
| `backend/.env` | Backend environment variables |
| `client/package.json` | Client dependencies (React 19, Vite 8, MUI 9, Redux Toolkit, etc.) |
| `client/.env` | Client environment variables |
| `client/index.html` | Vite entry HTML |
| `client/vite.config.js` | Vite configuration |
| `client/src/main.jsx` | React entry point |
| `client/src/App.jsx` | Root App component |
| `client/public/` | Static assets |
| `client/src/theme/` | MUI theme config (AppTheme.jsx, themePrimitives.js, customizations/) |
| `docs/phases/phase-1-summary.md` | This file |

## Package Decisions

- **bcryptjs** over bcrypt — pure-JS, no native compilation needed on Windows (see ADR-001).
- No `cookie` package — cookie-parser handles parsing; no server-side cookie manipulation needed.
- No frontend `dotenv` — Vite loads `VITE_`-prefixed env vars natively.
- Native `fetch` only — no axios.
- No TypeScript, no Tailwind, no Next.js, no automated test frameworks.

## State After Phase 1

- Repository foundation established.
- Client scaffolded with `npm create vite@latest --template react`.
- MUI theme files placed at `client/src/theme/` (will be wired in Phase 5).
- Backend foundation files in place (package.json, .env, dependencies installed).
- No backend source code or custom frontend components yet.
- Ready for Phase 2 (Backend Foundation).

## Patterns Established For Future Phases

Every pattern below is an architectural rule that future phases MUST respect.

### 1. Git Branch-Per-Phase Workflow

**Rule:** Every phase starts with a feature branch (`phase-N-description`). No direct commits to `main`. After user approval, stage → commit (`feat: phase N description`) → push → merge → delete branch. Never skip the approval step. Never amend after push.

### 2. ES Modules Only (Backend)

**Rule:** Backend uses ES Modules exclusively (`"type": "module"` in `backend/package.json`). All `import`/`export` syntax. No `require()`. No CommonJS.

### 3. No .env.example Files

**Rule:** `.env` files are gitignored and NOT committed. They exist locally with placeholder values. Every new environment variable must be added directly to the local `.env` — there are no `.env.example` files to maintain in sync (per ADR-006).

### 4. JavaScript Only — No TypeScript

**Rule:** The entire project is JavaScript. No `.ts`, `.tsx`, TypeScript config, or type packages (except `@types/react`/`@types/react-dom` for editor IntelliSense only — no runtime impact).

### 5. Stack Locked — No Substitutions

**Rule:** The stack is decided and locked:
- Frontend: React 19, Vite 8, MUI 9, Redux Toolkit, React Router 8, React Hook Form
- Backend: Express, Mongoose, ES Modules
- Auth: JWT in httpOnly cookies
- Styling: MUI `sx` and `styled()` — no Tailwind
- No Next.js, no Remix, no other frameworks

### 6. Workspace Scripts

**Rule:** Root `package.json` provides `install:all`, `dev:backend`, `dev:client`. Future phases may add scripts here but must NOT remove the existing ones. Scripts use `npm run` (not `yarn` or `pnpm`).

### 7. Client Scaffold Is Vite + React

**Rule:** The client was scaffolded with `npm create vite@latest --template react` (no TypeScript variant). Future phases must NOT re-scaffold or migrate to a different build tool.

### 8. MUI Theme Structure

**Rule:** All theme configuration lives in `client/src/theme/`:
- `themePrimitives.js` — brand colors, typography, shape, shadows
- `customizations/` — MUI component-specific style overrides
- `AppTheme.jsx` — composes and exports the theme provider
Future phases add component overrides via new files in `customizations/` and import them in `AppTheme.jsx`. Do NOT inline theme overrides in page components.
