# Phase 7 Summary — Branch and Report Backend Domain

## Completed

### Models
- **Branch** — name (enum from BRANCH_NAMES constant — 14 predefined Amharic names: ብስራተ ገብርኤል, ቡልቡላ, መስቀል ፍላወር, ጎላጎል, ጀሞ ሚካኤል, ሳር ቤት, ቤተል, 4 ኪሎ, ሰሚት, ኤርፖርት, ሲኤምሲ, ቱሉ ዲምቱ, ወዳጅነት ፓርክ, መድኃኔዓለም), code (unique index), branch, address, managerName, managerPhone, isActive, timestamps.<br>Branch schema field `area` renamed to `branch`. Indexes: `{ code: 1 }` unique, `{ name: 1 }`. Uses `mongoose-paginate-v2`.
- **Report** — user, reportDate, branches[], status, languageMode, supervisorName, notes, audioClips[] (embedded schema), transcription (embedded schema), reviewedTranscription, generatedReport (embedded schema), editedReport, exportHistory[] (embedded schema), timestamps. Indexes: `{ user: 1, reportDate: -1 }`, `{ user: 1, status: 1 }`, `{ branches: 1 }`. Uses `mongoose-paginate-v2`.
  - No `title` field required at creation — AI generates it from audio content.
  - Statuses: draft → audio_recorded → transcribed → transcription_reviewed → generated → finalized → exported.

### Services
- **Branch service** — `listBranches` (paginated with search by name/code, sort), `getBranchById`, `createBranch` (409 on duplicate code), `updateBranch` (409 on code conflict), `deactivateBranch` (soft delete via isActive=false). All write operations support session.
- **Report service** — `listReports` (paginated with search by supervisorName/notes, status/branch/date filter, scoped to user), `getReportById` (scoped to user), `createReport` (takes only date, branches; auto-sets supervisorName from auth user, status=draft), `updateReport` (scoped to user), `deleteReport` (only draft allowed), `generateMonthlyReport` (collects all reports for a month, groups by branch, returns summary stats + report list + `aiGenerated: false` flag), `exportReportsByDateRange` (returns all reports + metadata within a date range). All write operations support session.

### Controllers
- **Branch controller** — getBranches, getBranch, createBranch, updateBranch, deactivateBranch. Write operations use try/catch/finally with sessions.
- **Report controller** — getReports, getReport, createReport, updateReport, deleteReport, getMonthlyReport (wraps generateMonthlyReport service), exportReportsByDate (wraps exportReportsByDateRange service). Write operations use try/catch/finally with sessions.

### Validators
- **Branch validators** — createBranchRules (name enum from BRANCH_NAMES, code required; branch/address/managerName/managerPhone optional), updateBranchRules (all optional + isActive boolean).
- **Report validators** — createReportRules (reportDate required ISO8601, branches optional array of MongoIds), updateReportRules (all optional + status enum).

### Routes
- **Branch** — `GET /` (list), `GET /:id`, `POST /` (create), `PATCH /:id` (update), `DELETE /:id` (deactivate). All authenticated.
- **Report** — `GET /` (list), `GET /monthly` (monthly compilation), `GET /export` (date-range export), `GET /:id`, `POST /` (create), `PATCH /:id` (update), `DELETE /:id` (delete). All authenticated. `/monthly` and `/export` are registered before `/:id` to prevent route param collision.
- Both mounted in `routes/index.js` under `/api/v1/branches` and `/api/v1/reports`.

### Mock Data
- `backend/mock/data.js` — Seed data definitions: 2 users (beza ayalew, mehadir getachew; both area_supervisor), 14 branches (Amharic names), 10 reports across all workflow statuses.
- `backend/mock/index.js` — Run with `node backend/mock/index.js --inject` or `node backend/mock/index.js --wipe`.
  - **--inject**: Seeds users (4 reports for beza, 6 for mehadir), all 14 branches, all 10 reports (1 draft, 2 audio_recorded, 2 transcribed, 1 transcription_reviewed, 1 generated, 3 finalized). Passwords hashed via model pre-save hook (bcryptjs).
  - **--wipe**: Drops users, branches, reports, oauthaccounts, aigenerations collections directly (DDL unsupported in multi-doc transactions).
  - Reports are created via `Report.create([...], { session })` in a single batch for atomicity.
  - Refuses to run outside development mode.

## User-Requested Design Decisions
- Report creation only requires date and branch(es) — no title/description in form.
- UI language is English; report/audio language is Amharic (English optional).
- Edge case considered: audio with no meaningful information will be handled in Phase 11+ (audio transcription stage) via the transcription `status` and `errorMessage` fields.
- Mock data uses Amharic branch names matching PROBLEM_STATEMENT.md samples.
- Branch schema field renamed from `area` to `branch` to disambiguate the branch-area concept.
- `TASK_STATUS` constant (PENDING/ON_PROGRESS/COMPLETED) added for future task-level status tracking within reports.

## Files Created (14)

| File | Lines |
|---|---|
| `backend/src/models/branch.model.js` | 61 |
| `backend/src/models/report.model.js` | 133 |
| `backend/src/services/branch.service.js` | 104 |
| `backend/src/services/report.service.js` | 254 |
| `backend/src/services/profile.service.js` | 90 |
| `backend/src/controllers/branch.controller.js` | 80 |
| `backend/src/controllers/report.controller.js` | 136 |
| `backend/src/validators/branch.validators.js` | 60 |
| `backend/src/validators/report.validators.js` | 59 |
| `backend/src/routes/branch.routes.js` | 25 |
| `backend/src/routes/report.routes.js` | 24 |
| `backend/mock/data.js` | 401 |
| `backend/mock/index.js` | 187 |

## Files Modified (6)

| File | Change |
|---|---|
| `backend/src/routes/index.js` | Added branch and report route mounts |
| `backend/src/utils/constants.js` | Added `TASK_STATUS` constant, `AREA_SUPERVISOR` role (`'area_supervisor'`), `GENERAL_RATE_LIMIT` constant; removed dead `REPORT.TITLE_*` constants |
| `backend/src/services/report.service.js` | Added `generateMonthlyReport` (uses dynamic `statusCounts` — not hardcoded COMPLETED/PENDING/ON_PROGRESS), `exportReportsByDateRange` services |
| `backend/src/controllers/report.controller.js` | Added `getMonthlyReport`, `exportReportsByDate` controllers |
| `backend/src/middleware/security.middleware.js` | `generalLimiter` now uses `constants.GENERAL_RATE_LIMIT` (no hardcoded magic values) |
| `backend/src/controllers/profile.controller.js` | Refactored to delegate to `profile.service.js` (was calling User model directly) |
| `backend/package.json` | Removed unused `validator` package (never imported anywhere) |

## Convention Verifications

- express-async-handler wraps all controllers ✅
- Write controllers use try/catch/finally with MongoDB sessions ✅
- Controllers delegate to services ✅
- apiResponse for all responses ✅
- httpStatus imports (no hardcoded codes) ✅
- ApiError for operational errors ✅
- express-validator rules in validators/*.js, checked via validate middleware ✅
- JSDoc on all public modules/functions ✅
- Centralized constants used (BRANCH.*, REPORT_STATUS, PAGINATION, PHONE_MAX_LENGTH, GENERAL_RATE_LIMIT) ✅
- mongoose-paginate-v2 for list endpoints ✅
- All routes authenticated ✅
- Owner scoping on reports (user ID filter) ✅
- `normalizeEmail` not applicable (no email fields in branch/report) ✅
- Backend `node --check` — all files pass ✅
- Client `npx vite build` — 0 errors (no client changes) ✅
- Monthly route (`/monthly`) registered before `/:id` to prevent param collision ✅
- Export route (`/export`) registered before `/:id` to prevent param collision ✅
- `generateMonthlyReport` uses dynamic `statusCounts` (maps all 7 statuses) — NOT hardcoded COMPLETED/PENDING/ON_PROGRESS ✅
- `GENERAL_RATE_LIMIT` constant added to constants.js — `security.middleware.js` uses it instead of hardcoded magic values ✅

## Phase 7 Audit — Violations Found And Fixed

| # | File | Issue | Fix |
|---|---|---|---|
| 1 | `backend/src/services/report.service.js:193-195` | `generateMonthlyReport` referenced `constants.REPORT_STATUS.COMPLETED/PENDING/ON_PROGRESS` — none exist in report status enum (leftover from reverted status change) | Replaced with dynamic `statusCounts` iterating all 7 actual statuses |
| 2 | `backend/src/middleware/security.middleware.js:19-22` | `generalLimiter` used hardcoded magic values (`15 * 60 * 1000`, `max: 100`) — flagged in phase-1-4-validation but never fixed | Added `GENERAL_RATE_LIMIT` constant to constants.js and wired it in |
| 3 | `backend/src/utils/constants.js:82-83` | `REPORT.TITLE_MIN_LENGTH` / `TITLE_MAX_LENGTH` — defined but never used (Report model has no `title` field) | Removed dead `REPORT` block from constants |
| 4 | `backend/src/controllers/profile.controller.js` | Called `User.findById()`, `User.findByIdAndUpdate()`, `user.save()` directly — violated "controllers delegate to services" pattern | Created `profile.service.js` with `getProfile/updateProfile/changePassword`, refactored controller to delegate |
| 5 | `backend/package.json` | `validator` package listed as dependency but never imported anywhere | Removed unused `validator` dependency |
| 6 | `client/src/**` | All 48 source files verified — no violations found | (none) |

## Phase 7 Completion Criteria

- [x] Branch CRUD works (create, list, get, update, deactivate)
- [x] Report CRUD works (create, list, get, update, delete)
- [x] Pagination uses mongoose-paginate-v2
- [x] Sessions and controller rules followed
- [x] Mock data inject/wipe scripts created
- [x] Monthly report compilation endpoint (`GET /api/v1/reports/monthly`) implemented
- [x] Date-range export endpoint (`GET /api/v1/reports/export`) implemented
- [x] TASK_STATUS constant added for future task-level status system
- [x] Backend syntax validation passes
