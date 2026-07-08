# Phase 7 - Branch And Report Backend Domain

## Phase Goal

Implement backend domain models, validation, controllers, services, and routes for branches and reports, including pagination with `mongoose-paginate-v2`.

## Mandatory Phase Protocol

### Step 1: Pre-Git Requirement

Run `git status`, `git branch -vv`, and `git fetch origin`. Handle missing remote, uncommitted changes, behind branches, and conflicts exactly as required. Create `phase-7-branch-report-backend-domain`. Verify state before implementation.

### Step 2: Comprehensive And Extremely Deep Codebase Analysis

Read backend models, auth middleware, route patterns, constants, validators, services, docs, and all previous phase summaries.

### Step 3: Comprehensive And Extremely Deep Analysis Of Previously Implemented All Phases

Analyze Phases 1-6. Ensure branch/report APIs follow established auth, response, error, session, and validation patterns.

### Step 4: Phase Execution Without Deviation

Implement backend Branch and Report domain.

Required files:

```text
backend/src/models/branch.model.js
backend/src/models/report.model.js
backend/src/controllers/branch.controller.js
backend/src/controllers/report.controller.js
backend/src/routes/branch.routes.js
backend/src/routes/report.routes.js
backend/src/services/branch.service.js
backend/src/services/report.service.js
backend/src/validators/branch.validators.js
backend/src/validators/report.validators.js
```

Branch model:

- name
- code
- area
- address
- managerName
- managerPhone
- isActive
- timestamps

Branch indexes:

- `branchSchema.index({ code: 1 }, { unique: true })`
- `branchSchema.index({ name: 1 })`
- Do not use `unique: true` on fields.

Report model:

- user
- reportDate
- title
- branches array
- status
- languageMode
- supervisorName snapshot
- notes optional
- audioClips array placeholder metadata
- transcription object placeholder
- reviewedTranscription
- generatedReport placeholder
- editedReport placeholder
- exportHistory placeholder
- timestamps

Report statuses:

- `draft`
- `audio_recorded`
- `transcribed`
- `transcription_reviewed`
- `generated`
- `finalized`
- `exported`

Report indexes:

- `{ user: 1, reportDate: -1 }`
- `{ user: 1, status: 1 }`
- `{ branches: 1 }`

Pagination:

- Use `mongoose-paginate-v2`.
- List endpoints must accept page, limit, sort, search, status, branch, date range.
- Put pagination constants in `backend/src/utils/constants.js`.

Branch endpoints:

- `GET /api/v1/branches`
- `GET /api/v1/branches/:id`
- `POST /api/v1/branches`
- `PATCH /api/v1/branches/:id`
- `DELETE /api/v1/branches/:id` as soft delete or deactivate.

Report endpoints:

- `GET /api/v1/reports`
- `GET /api/v1/reports/:id`
- `POST /api/v1/reports`
- `PATCH /api/v1/reports/:id`
- `DELETE /api/v1/reports/:id` as soft delete or status-safe delete.

Controller rules:

- Every controller uses `asyncHandler(async (req, res, next) => { ... })`.
- Every controller passes errors with `next(error)`.
- Every write controller uses `try`, `catch`, and `finally`.
- Every write controller supports MongoDB sessions.
- Authorize by user ownership for reports.

Update docs:

- `docs/phases/phase-7-summary.md`
- `docs/ARCHITECTURE.md` data model section.

Manual verification:

- Create/list/update/deactivate branches.
- Create/list/update/delete reports.
- Verify pagination metadata.
- Do not add automated tests.

### Step 5: User Review And Feedback Integration

Present endpoints, models, pagination behavior, manual verification, and any assumptions. Ask for explicit approval before Step 6.

### Step 6: Post-Git Requirement

After explicit approval only, complete Git status/fetch/diff/stage/commit/push/merge/delete/verify using commit message `feat: phase 7 branch and report backend domain`.

## Phase Completion Criteria

- Branch CRUD works.
- Report CRUD works.
- Pagination uses `mongoose-paginate-v2`.
- Sessions and controller rules are followed.
