# Phase 2 - Backend Foundation

## Phase Goal

Build the Express backend foundation with MongoDB connection, app setup, security middleware, constants, config, error handling, health routes, response helpers, and development scripts.

## Mandatory Phase Protocol

### Step 1: Pre-Git Requirement

Run `git status`, `git branch -vv`, and `git fetch origin`. Handle missing remote, uncommitted changes, behind branches, and conflicts exactly as required. Create `phase-2-backend-foundation`. Verify clean/understood state before implementation.

### Step 2: Comprehensive And Extremely Deep Codebase Analysis

Read all root, backend, docs, and Phase 1 files. Confirm package decisions, env examples, existing scripts, and directory structure.

### Step 3: Comprehensive And Extremely Deep Analysis Of Previously Implemented All Phases

Analyze Phase 1 summary and docs. Ensure this phase continues the documented architecture and does not duplicate or contradict Phase 1.

### Step 4: Phase Execution Without Deviation

Implement backend source under `backend/src`.

Required files:

```text
backend/src/app.js
backend/src/server.js
backend/src/config/env.js
backend/src/config/db.js
backend/src/middleware/error.middleware.js
backend/src/middleware/notFound.middleware.js
backend/src/middleware/security.middleware.js
backend/src/middleware/requestLogger.middleware.js
backend/src/routes/index.js
backend/src/routes/health.routes.js
backend/src/controllers/health.controller.js
backend/src/utils/apiError.js
backend/src/utils/apiResponse.js
backend/src/utils/constants.js
backend/src/utils/httpStatus.js
backend/src/utils/asyncHandler.js
backend/src/utils/logger.js
```

Backend rules:

- ES Modules only.
- Use JSDoc block comments in every file and exported function.
- All controllers use `asyncHandler(async (req, res, next) => { ... })`.
- Health controller must still accept `next` and pass errors to global handler.
- Global error handler returns consistent JSON.
- Use `helmet`, `cors`, `compression`, `cookie-parser`, `express-mongo-sanitize`, and `express-rate-limit`.
- Use `morgan` only in development.
- Use constants from `backend/src/utils/constants.js`; no hardcoded magic values in app code.
- Mongo connection must support local MongoDB Compass using `MONGODB_URI`.
- Graceful shutdown for `SIGINT` and `SIGTERM`.
- Do not add auth, users, reports, branches, or Addis AI calls yet.

Required API endpoints:

- `GET /api/v1/health`
- `GET /api/v1/health/db`

Expected health response:

```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "service": "Report Builder V1 API",
    "environment": "development"
  }
}
```

Update docs:

- `docs/phases/phase-2-summary.md`
- Update `docs/ARCHITECTURE.md` with implemented backend foundation.
- Update `README.md` backend commands if needed.

Manual verification:

- Install backend packages if not installed.
- Run backend dev server.
- Verify health route manually with browser/curl if possible.
- Do not add automated tests.

### Step 5: User Review And Feedback Integration

Present implemented backend foundation, commands run, health endpoint behavior, and any issues. Ask for explicit approval before Step 6.

### Step 6: Post-Git Requirement

After explicit approval only, run status/branch/fetch/diff, stage, commit with `feat: phase 2 backend foundation`, push branch if remote exists, merge into base branch, push base if remote exists, delete merged feature branch, and verify final clean sync.

## Phase Completion Criteria

- Backend starts.
- Health routes work.
- Mongo connection module exists.
- Security middleware and error handler exist.
- Docs updated.
