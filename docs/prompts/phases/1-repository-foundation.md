# Phase 1 - Repository Foundation And Documentation

## Phase Goal

Create the project foundation for `Report-Builder-V1` without implementing application features yet. This phase must establish the repository structure, documentation, environment examples, package manifests, scripts, ignore files, and decision records needed for later phases.

## Mandatory Phase Protocol

### Step 1: Pre-Git Requirement

1. Run `git status`.
2. Run `git branch -vv`.
3. Run `git fetch origin`.
4. If `origin` does not exist or fetch fails because no remote is configured, report that clearly. Continue local phase work only if the user allows local-only progress, and document that push/merge/delete remote branch operations are blocked until a remote exists.
5. If uncommitted changes exist, inspect them carefully. Do not overwrite user work. If they belong to a previous approved phase, stage, commit, push, merge, and delete the feature branch only after user approval. If they are unrelated or ambiguous, halt and ask the user.
6. If local base branch is behind remote, pull it. If conflicts occur, halt and ask the user.
7. Create a feature branch named `phase-1-repository-foundation`.
8. Run `git status` again and proceed only after the state is understood.

### Step 2: Comprehensive And Extremely Deep Codebase Analysis

Analyze every existing file and folder. Because the repo may be empty, explicitly confirm whether only `.git` and prompt/docs files exist. Check for `package.json`, `.gitignore`, `backend`, `client`, and `docs`.

### Step 3: Comprehensive And Extremely Deep Analysis Of Previously Implemented All Phases

Because this is Phase 1, there are no previously implemented application phases. Confirm this and record the baseline state.

### Step 4: Phase Execution Without Deviation

Implement the foundation only.

Required structure:

```text
backend/
client/
docs/
docs/decisions/
docs/research/
docs/phases/
```

Root files:

- `.gitignore`
- `README.md`
- `package.json`
- `docs/PROJECT_OVERVIEW.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT_PHASES.md`
- `docs/PACKAGE_DECISIONS.md`
- `docs/research/addis-ai.md`
- `docs/phases/phase-1-summary.md`
- `backend/package.json`
- `backend/.env.example`
- `client/package.json`
- `client/.env.example`

Backend `package.json`:

- Use `"type": "module"`.
- Dependencies:
  - `bcrypt`
  - `compression`
  - `cookie-parser`
  - `cors`
  - `dayjs`
  - `dotenv`
  - `express`
  - `express-async-handler`
  - `express-mongo-sanitize`
  - `express-rate-limit`
  - `express-validator`
  - `helmet`
  - `jsonwebtoken`
  - `mongoose`
  - `mongoose-paginate-v2`
  - `multer`
  - `validator`
- Dev dependencies:
  - `morgan`
  - `nodemon`
- Do not install `cookie` unless a concrete need is documented.

Client `package.json`:

- Use `"type": "module"`.
- Dependencies:
  - `@emotion/react`
  - `@emotion/styled`
  - `@fontsource/inter`
  - `@mui/icons-material`
  - `@mui/lab`
  - `@mui/material`
  - `@mui/x-charts`
  - `@mui/x-data-grid`
  - `@mui/x-date-pickers`
  - `@reduxjs/toolkit`
  - `dayjs`
  - `exceljs`
  - `file-saver`
  - `jspdf`
  - `jspdf-autotable`
  - `react`
  - `react-dom`
  - `react-error-boundary`
  - `react-hook-form`
  - `react-redux`
  - `react-router`
  - `react-toastify`
  - `redux-persist`
- Dev dependencies:
  - `@vitejs/plugin-react`
  - `vite`
- Do not install frontend `dotenv`.

Documentation requirements:

- `README.md` must explain product purpose, tech stack, local setup, environment files, and phase workflow.
- `docs/PRD.md` must include product vision, users, workflow, functional requirements, non-functional requirements, security requirements, and export requirements.
- `docs/ARCHITECTURE.md` must describe backend, frontend, data model direction, Addis AI backend proxy, and MongoDB Compass setup.
- `docs/research/addis-ai.md` must summarize concrete Addis AI findings:
  - base URL `https://api.addisassistant.com`
  - dashboard `https://platform.addisassistant.com`
  - backend-only API key rule
  - STT `/api/v2/stt`
  - text generation `/api/v1/chat_generate`
  - TTS `/api/v1/audio`
  - translation `/api/v1/translate`
  - realtime WebSocket
  - STT file limits and supported formats
  - error codes and handling
- `docs/PACKAGE_DECISIONS.md` must list chosen packages and explicitly state why `cookie` and frontend `dotenv` are not installed.
- `docs/DEVELOPMENT_PHASES.md` must list all 16 phases.

Do not create app source code beyond placeholder directory `.gitkeep` files if needed.
Do not implement backend server code yet.
Do not implement Vite app code yet.
Do not add tests.

### Step 5: User Review And Feedback Integration

Present:

- Files created.
- Package decisions.
- Any blocked Git remote operations.
- Ask the user to review and explicitly approve before Step 6.

Do not proceed to Step 6 without explicit approval.

### Step 6: Post-Git Requirement

Only after explicit approval:

1. Run `git status`.
2. Run `git branch -vv`.
3. Run `git fetch origin`.
4. Run `git diff`.
5. Stage changes with `git add .`.
6. Verify staged files with `git status`.
7. Commit with `feat: phase 1 repository foundation`.
8. Push feature branch if remote exists.
9. Checkout base branch.
10. Pull base branch if remote exists.
11. Merge `phase-1-repository-foundation`.
12. Push base branch if remote exists.
13. Verify merge.
14. Delete local and remote feature branches only after verifying merge.
15. Final `git status`, `git branch -vv`, and `git log --oneline -5`.

## Phase Completion Criteria

- Repository has `backend`, `client`, and `docs` foundations.
- Environment examples exist.
- Package manifests exist but app feature code is not implemented.
- Addis AI research summary exists.
- Phase 1 summary exists.
- User has reviewed before Git finalization.
