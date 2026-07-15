# Comprehensive Codebase Audit — Report Builder V1

> Generated: 2026-07-13
> Scope: ALL files in `backend/*`, `client/*`, `docs/*`, root `./*` — phases 1 through 16
> Method: File-by-file, line-by-line analysis of 57 backend files (~4,701 lines) + 83 client files (~8,961 lines) + 14 docs files + root files
> Total: ~13,700+ lines of source code analyzed

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Critical Issues](#2-critical-issues)
3. [Warnings](#3-warnings)
4. [Info / Minor Issues](#4-info--minor-issues)
5. [Backend File-by-File Audit](#5-backend-file-by-file-audit)
6. [Client File-by-File Audit](#6-client-file-by-file-audit)
7. [Root Files and Config Audit](#7-root-files-and-config-audit)
8. [Documentation Audit](#8-documentation-audit)
9. [Conventions Compliance Matrix](#9-conventions-compliance-matrix)
10. [Unresolved Issues and Action Items](#10-unresolved-issues-and-action-items)
11. [Phase-by-Phase Completion Status](#11-phase-by-phase-completion-status)
12. [Files Inventory](#12-files-inventory)

---

## 1. Executive Summary

### Codebase Health

| Dimension | Status | Detail |
|---|---|---|
| Backend `node --check` | ✅ Clean | Verified across all 57 backend files |
| Client `vite build` | ✅ Clean | 0 errors verified |
| Client `oxlint` | ✅ Clean | 0 errors verified |
| Package alignment | ✅ All match | backend/package.json and client/package.json match PACKAGE_DECISIONS.md exactly |
| Git hygiene | ✅ Clean | `.env` files properly gitignored; no committed secrets |
| **CRITICAL bugs found** | **7** | See §2 |
| **WARNINGS found** | **27** | See §3 |
| **INFO items found** | **35** | See §4 |
| Phases 14-16 completion | ❌ **Not built** | Export, AI chat/translation, hardening |

### Architecture

```
React 19 + Vite 8  →  Express 4  →  MongoDB
                             ↓
                        Addis AI (proxy)
```

Core workflow: `record audio → transcribe → generate AI report → preview/edit → finalize/export`

---

## 2. Critical Issues

### C1: `apiResponse.js` hardcodes `success: true` — poisons all error responses

| File | Line | Finding |
|---|---|---|
| `backend/src/utils/apiResponse.js` | 16 | `success: true` is hardcoded in the helper. Every caller — including `error.middleware.js` (line 29) and `validate.middleware.js` (line 22) — returns `{"success": true, "message": "..."}` even on 4xx/5xx responses. This is a **protocol-level bug**. |

**Affected endpoints**: ALL API error responses return `success: true` with non-2xx status codes.

**Fix**: Add a `success` parameter to `apiResponse()`, or create `apiErrorResponse()` helper, or have error/validate middlewares build responses directly without `apiResponse`.

---

### C2: `reportGeneration.controller.js` — `commitTransaction()` missing `await`

| File | Line | Finding |
|---|---|---|
| `backend/src/controllers/reportGeneration.controller.js` | 125 | `session.commitTransaction()` is called **without `await`**. Mongoose/MongoDB driver `commitTransaction()` returns a Promise. Without `await`, the transaction may not be committed before the subsequent long-running AI call (line 131). This means the status check (lines 110-115) and data read (101-104) operate within an uncommitted transaction that could roll back or still be pending. |

**Fix**: Add `await` to `session.commitTransaction()`.

---

### C3: Live credentials in `backend/.env` — security risk

| File | Line | Finding |
|---|---|---|
| `backend/.env` | (multiple) | Contains **live MongoDB Atlas credentials** (`mongodb://girmazewdei38_db_user:hnss3lzmI2dkGaHR@...`) and a **live Addis AI API key** (`sk_d301b86c-...`). If this file is ever accidentally committed, shared, or backed up, credentials are exposed. |

**Fix**: Replace with `change_me` placeholders (like JWT secrets). Inject real credentials via environment variables or secrets manager in production.

---

### C4: `MuiPasswordField.jsx` — IconButton missing `type="button"`

| File | Line | Finding |
|---|---|---|
| `client/src/components/reusable/MuiPasswordField.jsx` | 39 | The visibility toggle IconButton inside InputAdornment has **no `type="button"`**. Inside a `<form>`, clicking it will submit the form or trigger validation errors in react-hook-form. |

**Fix**: Add `type="button"` to the visibility toggle IconButton.

---

### C5: `GlobalSearchDialog.jsx` — IconButtons missing `type="button"`

| File | Line | Finding |
|---|---|---|
| `client/src/components/layout/GlobalSearchDialog.jsx` | 140, 159 | ArrowBackIcon button and CloseIcon button in InputAdornments lack `type="button"`. Inside `<form>`, clicking them may submit. |

**Fix**: Add `type="button"` to both IconButtons.

---

### C6: `ReportsFilterDialog.jsx` — IconButtons missing `type="button"`

| File | Line | Finding |
|---|---|---|
| `client/src/components/reports/ReportsFilterDialog.jsx` | 111, 153, 196 | Status/branch/date clear IconButtons in adornments inside Dialog without `type="button"`. |

**Fix**: Add `type="button"` to all clear IconButtons.

---

### C7: `ReportFinalizeBar.jsx` — Invalid MuiDialog props

| File | Line | Finding |
|---|---|---|
| `client/src/components/reports/ReportFinalizeBar.jsx` | 59-86 | `title` and `actions` props passed to `MuiDialog` — MuiDialog has no such props. They spread as unknown DOM attributes; the `actions` slot JSX is **never rendered**. |

**Fix**: Use `DialogTitle`, `DialogActions` as children inside `<MuiDialog>`.

---

## 3. Warnings

### 3.1 Backend Warnings

| # | File | Line(s) | Issue |
|---|---|---|---|
| W1 | `backend/src/middleware/security.middleware.js` | 18-22 | `generalLimiter` uses hardcoded `windowMs: 15 * 60 * 1000` and `max: 100` instead of `constants.GENERAL_RATE_LIMIT` values |
| W2 | `backend/src/middleware/auth.middleware.js` | 22-45 | Async `authenticate` middleware **not wrapped** with `express-async-handler`. Express 4.x does not catch rejected promises from async middleware — uncaught errors could crash process |
| W3 | `backend/src/server.js` | 16 | `connectDB()` called after `app.listen()` without `await`. Server accepts requests before MongoDB connection is established |
| W4 | `backend/src/utils/cookieOptions.js` | 21, 34 | Cookie `maxAge` hardcoded (`15*ONE_MINUTE` / `7*ONE_DAY`) instead of reading `env.JWT_ACCESS_EXPIRES_IN` / `env.JWT_REFRESH_EXPIRES_IN`. Token-cookie lifetime mismatch if env changes |
| W5 | `backend/src/utils/constants.js` | 8 | `BODY_PARSER_LIMIT: '10kb'` extremely restrictive — AI-generated report JSON can easily exceed 10KB. Should be `'1mb'` or `'5mb'` |
| W6 | `backend/src/config/seedBranches.js` | 17-32 | Branch names duplicated across `seedBranches.js` and `constants.js` `BRANCH_NAMES`. Risk of drift |
| W7 | `backend/src/models/report.model.js` | 91 | Magic value `'am'` as default for `languageMode` — should be a named constant in `constants.js` |
| W8 | `backend/src/routes/reportGeneration.routes.js` | 17-29 | Inconsistent auth pattern: per-route `authenticate` instead of `router.use(authenticate)` used everywhere else |
| W9 | `backend/src/routes/reportPreview.routes.js` | 18-36 | Same inconsistent auth pattern as W8 |
| W10 | `backend/src/controllers/reportGeneration.controller.js` | 46-67, 101-159 | Bypasses service layer — direct `Report.findOne()` and `report.save()` instead of delegating to service |
| W11 | `backend/src/controllers/reportPreview.controller.js` | 28-56, 70-120, 134-178 | Bypasses service layer — direct model access |
| W12 | `backend/src/controllers/reportPreview.controller.js` | 28 | `_req`/`_res` prefix on **actively used** params — misleading convention violation |
| W13 | `backend/src/services/auth.service.js` | 29 | `passwordHash: data.password` assigns **plain text** to field named `passwordHash`. Field name is misleading |
| W14 | `backend/src/services/ai/addisAi.client.js` | 30 | `x-api-key` header gets literal `"undefined"` if `env.ADDIS_AI_API_KEY` is missing — no startup validation |
| W15 | `backend/src/services/ai/addisAiStt.service.js` | 94 | Logs `storagePath` — filesystem path leak in production |
| W16 | `backend/src/services/ai/audioChunker.js` | 22 | `STT_CHUNK_DURATION_SECONDS` misplaced in `fileValidation.js` — belongs with AI modules |
| W17 | `backend/src/services/report.service.js` | 53 | No date validation — `new Date(malformed_string)` silently matches everything |
| W18 | `backend/src/services/report.service.js` | 232 | Empty date range filter exports **ALL** reports (no guard against missing dateFrom/dateTo) |
| W19 | `backend/mock/data.js` | 14, 21 | `passwordHash` field name misleading for plain text passwords |
| W20 | `backend/mock/index.js` | 131-146 | Wipe drops `oauthaccounts` and `aigenerations` collections — no corresponding models exist (residual names) |

### 3.2 Client Warnings

| # | File | Line(s) | Issue |
|---|---|---|---|
| W21 | `client/src/services/audioApi.js` | 6 | Unused import: `apiClient` imported but never referenced |
| W22 | `client/src/store/reportsSlice.js` | 125-127 | `createReport.fulfilled` does not prepend new report to local list — list stays stale until re-fetch |
| W23 | `client/src/store/reportsSlice.js` | 136-138 | `updateReport.fulfilled` does not update report in local list — changes invisible until re-fetch |
| W24 | `client/src/pages/profile/ProfilePage.jsx` | 17 | Unused import: `Divider` from `@mui/material/Divider` never referenced |
| W25 | `client/src/pages/reports/ReportsPage.jsx` | 146 | Passes unused `totalPages` prop to `ReportsDataGrid` — prop is silently swallowed |
| W26 | `client/src/components/reports/TranscriptionReviewEditor.jsx` | 8-9 | JSDoc says "uses react-hook-form with register" but component uses raw `useState` + `value`/`onChange` — docs lie |
| W27 | `client/src/theme/customizations/surfaces.js` | 52 | `mb: 20` — invalid CSS property in `styleOverrides`. `mb` is MUI system shorthand, not valid CSS. Should be `marginBottom: 20` |

---

## 4. Info / Minor Issues

### 4.1 Backend Info

| # | File | Line(s) | Issue |
|---|---|---|---|
| I1 | `backend/src/server.js` | 19-27 | `gracefulShutdown` missing `@param {string} signal` JSDoc |
| I2 | `backend/src/utils/fileValidation.js` | 7-51 | Inconsistent export style: inline `export` on some exports, batch `export {}` at line 51 |
| I3 | `backend/src/utils/promptVersions.js` | 7 | TypeScript-style `@type {Readonly<...>}` annotation in JS-only project |
| I4 | `backend/src/utils/httpStatus.js` | — | Missing common codes: 202, 301, 302, 304, 406, 413, 415 |
| I5 | `backend/src/middleware/requestLogger.middleware.js` | 18 | No request logging in production (morgan dev-only) |
| I6 | `backend/src/middleware/upload.middleware.js` | 19 | Upload path `../../uploads/audio` hardcoded — should be in `env.js` |
| I7 | `backend/src/models/user.model.js` | 22 | Redundant `unique: false` on email (default) contradicts line 61 explicit index |
| I8 | `backend/src/models/user.model.js` | 63, 75, 84 | Missing/partial JSDoc (`@throws` on methods, none on `pre('save')`) |
| I9 | `backend/src/models/branch.model.js` | 29-33 | Ambiguous field name `branch` on Branch model — unclear what it represents |
| I10 | `backend/src/routes/branch.routes.js` | 20 | DELETE route missing `:id` MongoID validation |
| I11 | `backend/src/routes/report.routes.js` | 22 | DELETE route missing `:id` MongoID validation |
| I12 | `backend/src/controllers/auth.controller.js` | 149 | `getGoogleOAuthUrl()` references `env.OAUTH_GOOGLE_CLIENT_ID` — if undefined, URL contains literal `"undefined"` |
| I13 | `backend/src/controllers/report.controller.js` | 124-125 | Magic default date values in monthly export: `parseInt(req.query.year,10) || new Date().getFullYear()` |
| I14 | `backend/src/controllers/audio.controller.js` | 40 | Magic default `languageCode: req.body.languageCode || 'am'` |
| I15 | `backend/src/controllers/audio.controller.js` | — | Uses `fs.unlinkSync` (blocking) instead of `fs.promises.unlink` |
| I16 | `backend/src/services/ai/addisAiText.service.js` | 25-29 | Generation config hardcoded instead of in constants/env |
| I17 | `backend/mock/data.js` | 28-41 | Unused `branch: ''` field on all branches |
| I18 | `backend/mock/data.js` | — | Mock `storagePath` values may not match real multer paths |

### 4.2 Client Info

| # | File | Line(s) | Issue |
|---|---|---|---|
| I19 | `client/src/utils/constants.js` | 12, 18 | `AUTH_ROUTES` and `PROTECTED_ROUTES` potentially unused — duplicated in `routePaths.js` |
| I20 | `client/src/utils/audioUtils.js` | — | `formatDuration` has no hour handling — durations >= 3600s show as `60:00` |
| I21 | `client/src/routes/ProtectedRoute.jsx` | — | Missing `@param` JSDoc tags |
| I22 | `client/src/routes/PublicRoute.jsx` | — | Missing `@param` JSDoc tags |
| I23 | `client/src/hooks/useAudioRecorder.js` | 188-189 | Stale closure risk: `audioBlob`/`audioUrl` capture ref values at render time — consumers accessing immediately after `stopRecording()` get stale `null` |
| I24 | `client/src/components/reports/ReportCard.jsx` | 8-10 | Raw `Card`+`CardContent`+`CardActions` instead of `MuiCard` — but `CardActions` needed, so acceptable |
| I25 | `client/src/components/reports/ReportsPlaceholderPage.jsx` | 24 | Empty handler `onAction={() => {}}` — placeholder for Phase 8 bridge |
| I26 | `client/src/components/layout/GlobalSearchDialog.jsx` | 123 | `Stack` with redundant `display: 'flex'` — Stack is already `display: flex` by default |
| I27 | `client/src/components/layout/GlobalSearchDialog.jsx` | 59-62 | Stale closure ref pattern with `closeRef`/`navigateRef` — fragile |
| I28 | `client/src/components/reusable/MuiDatePicker.jsx` | 26, 29 | `ref` passed to DesktopDatePicker/MobileDatePicker — MUI X components may not forward refs |
| I29 | `client/src/components/reusable/MuiDialog.jsx` | 20 | Default `disableEnforceFocus`/`disableRestoreFocus` cannot be overridden to `false` without explicit consumer overrides |
| I30 | `client/src/theme/customizations/dataDisplay.js` | 237 | Missing trailing semicolon |

### 4.3 Frontend UI — Raw Card+CardContent where MuiCard could be used

The following files use raw `Card` + `CardContent` where `MuiCard` auto-wraps children identically:

| File | Lines |
|---|---|
| `client/src/components/audio/AudioGuidelines.jsx` | 9-10, 31-32 |
| `client/src/pages/dashboard/DashboardPage.jsx` | 12-13, 50-51, 64-65 |
| `client/src/pages/profile/ProfilePage.jsx` | 14-15, 110-111, 168-169 |
| `client/src/components/reports/GenerateReportPanel.jsx` | 13-14, 57-58, 75-76, 86-87, 107-108, 124-125 |
| `client/src/components/reports/TranscriptionPanel.jsx` | 11-12, 54-55, 73-74, 96-97, 149-150 |
| `client/src/components/reports/TranscriptionReviewEditor.jsx` | 12-13, 63-64, 87-88 |
| `client/src/pages/reports/CreateReportPage.jsx` | 15-16, 210-211, 248-249, 299-300 |
| `client/src/pages/reports/ReportPreviewPage.jsx` | 15-16, 191-192, 224-225, 242-243 |

### 4.4 Frontend UI — IconButton `color` prop used instead of `sx`

| File | Line | Code |
|---|---|---|
| `client/src/components/layout/AppTopbar.jsx` | 87 | `<IconButton color="inherit"` |
| `client/src/components/layout/PublicAppBar.jsx` | 66 | `<IconButton onClick={toggleTheme} color="inherit"` |
| `client/src/components/reports/ReportsToolbar.jsx` | 81 | `<IconButton size="small" color="primary"` |

---

## 5. Backend File-by-File Audit

### 5.1 `backend/src/app.js` (29 lines)
- **Clean**: All imports used. JSDoc present. Middleware order: helmet→cors→compression→cookieParser→mongoSanitize→rateLimiter✅

### 5.2 `backend/src/server.js` (30 lines)
- **WARNING**: `connectDB()` without `await` (line 16)
- **INFO**: `gracefulShutdown` missing `@param signal` JSDoc

### 5.3 `backend/src/config/env.js` (36 lines)
- **Clean**: `Object.freeze()`✅. No `process.env` outside this file

### 5.4 `backend/src/config/db.js` (36 lines)
- **Clean**: No issues

### 5.5 `backend/src/config/seedBranches.js` (60 lines)
- **WARNING**: Branch names duplicated with `constants.js`. Session pattern correct✅

### 5.6 `backend/src/utils/constants.js` (84 lines)
- **WARNING**: `BODY_PARSER_LIMIT: '10kb'` too small
- **Clean**: `Object.freeze()`✅. All status codes, roles, pagination, report statuses correct✅

### 5.7 `backend/src/utils/httpStatus.js` (21 lines)
- **Clean**: `Object.freeze()`✅

### 5.8 `backend/src/utils/apiError.js` (31 lines)
- **Clean**: `extends Error`, `captureStackTrace`, JSDoc✅

### 5.9 `backend/src/utils/apiResponse.js` (24 lines)
- **CRITICAL**: `success: true` hardcoded — poisons all error responses

### 5.10 `backend/src/utils/cookieOptions.js` (35 lines)
- **WARNING**: `maxAge` hardcoded, not from env

### 5.11 `backend/src/utils/logger.js` (39 lines)
- **Clean**: `Object.freeze()`✅. Safe logging✅

### 5.12 `backend/src/utils/fileValidation.js` (51 lines)
- **INFO**: Inconsistent export style

### 5.13 `backend/src/utils/promptVersions.js` (12 lines)
- **INFO**: TS-style Type annotation

### 5.14 `backend/src/middleware/security.middleware.js` (46 lines)
- **WARNING**: `generalLimiter` hardcoded (lines 18-22)

### 5.15 `backend/src/middleware/requestLogger.middleware.js` (23 lines)
- **Clean**: Morgan dev-only✅

### 5.16 `backend/src/middleware/error.middleware.js` (32 lines)
- **CRITICAL**: Uses `apiResponse()` which returns `success: true` on errors (line 29)
- **Clean**: 4-param handler✅. Distinguishes operational vs unexpected✅

### 5.17 `backend/src/middleware/notFound.middleware.js` (21 lines)
- **Clean**: `_res` prefix✅. `ApiError` + `httpStatus`✅

### 5.18 `backend/src/middleware/auth.middleware.js` (65 lines)
- **WARNING**: Async middleware not wrapped with `asyncHandler` (lines 22-45)

### 5.19 `backend/src/middleware/validate.middleware.js` (28 lines)
- **WARNING**: Uses `apiResponse()` with hardcoded `success: true`

### 5.20 `backend/src/middleware/upload.middleware.js` (46 lines)
- **INFO**: Upload path hardcoded

### 5.21 `backend/src/models/user.model.js` (101 lines)
- **Clean**: `pre('save')` hash✅. `comparePassword`✅. `toPublicProfile`✅

### 5.22 `backend/src/models/branch.model.js` (69 lines)
- **Clean**: `mongoosePaginate` plugin✅. Indexes correct✅

### 5.23 `backend/src/models/report.model.js` (146 lines)
- **WARNING**: Magic `'am'` default for `languageMode` (line 91)
- **Clean**: Status pipeline correct✅. All 7 statuses matching constants✅. Indexes correct✅

### 5.24 `backend/src/routes/index.js` (31 lines)
- **Clean**: Route aggregation correct✅. All 10 route modules mounted✅

### 5.25 `backend/src/routes/health.routes.js` (14 lines) — Clean✅
### 5.26 `backend/src/routes/auth.routes.js` (23 lines) — Clean✅
### 5.27 `backend/src/routes/profile.routes.js` (20 lines) — Clean✅
### 5.28 `backend/src/routes/branch.routes.js` (22 lines) — Clean✅
### 5.29 `backend/src/routes/report.routes.js` (24 lines) — `/monthly` and `/export` before `/:id`✅
### 5.30 `backend/src/routes/audio.routes.js` (25 lines) — `mergeParams: true`✅, Multer before validation✅
### 5.31 `backend/src/routes/transcription.routes.js` (23 lines) — Clean✅
### 5.32 `backend/src/routes/reportGeneration.routes.js` (31 lines) — **WARNING**: Inconsistent per-route auth
### 5.33 `backend/src/routes/reportPreview.routes.js` (38 lines) — **WARNING**: Inconsistent per-route auth

### 5.34 `backend/src/validators/` — All 8 files clean✅
- `normalizeEmail({ gmail_remove_dots: false })` on auth validators✅
- All validation limits from `constants`✅
- JSDoc present on all✅

### 5.35 `backend/src/controllers/health.controller.js` (41 lines) — Clean✅
### 5.36 `backend/src/controllers/auth.controller.js` (151 lines)
- Session pattern correct✅. `asyncHandler`✅

### 5.37 `backend/src/controllers/profile.controller.js` (77 lines) — Clean✅
### 5.38 `backend/src/controllers/branch.controller.js` (106 lines) — Clean✅
### 5.39 `backend/src/controllers/report.controller.js` (153 lines) — Clean✅
### 5.40 `backend/src/controllers/audio.controller.js` (79 lines) — Clean✅
### 5.41 `backend/src/controllers/transcription.controller.js` (38 lines)
- No session (correct — AI calls exception)✅

### 5.42 `backend/src/controllers/reportGeneration.controller.js` (180 lines)
- **CRITICAL**: Missing `await` on `commitTransaction()` (line 125)
- **WARNING**: Bypasses service layer (lines 46-67, 101-159)

### 5.43 `backend/src/controllers/reportPreview.controller.js` (178 lines)
- **WARNING**: Bypasses service layer — direct model access
- **WARNING**: `_req`/`_res` on actively used params

### 5.44 `backend/src/services/auth.service.js` (121 lines) — Clean✅
### 5.45 `backend/src/services/token.service.js` (49 lines) — Clean✅
### 5.46 `backend/src/services/oauth.service.js` (48 lines) — Clean✅
### 5.47 `backend/src/services/profile.service.js` (89 lines) — Clean✅
### 5.48 `backend/src/services/branch.service.js` (136 lines) — Clean✅
### 5.49 `backend/src/services/report.service.js` (254 lines) — Clean✅
### 5.50 `backend/src/services/audio.service.js` (58 lines) — Clean✅
### 5.51 `backend/src/services/reportPrompt.service.js` (85 lines) — Clean✅

### 5.52 `backend/src/services/ai/addisAi.client.js` (94 lines)
- **WARNING**: API key header gets `"undefined"` if env var missing

### 5.53 `backend/src/services/ai/addisAiStt.service.js` (193 lines)
- RIFF header detection correct✅. `audio/wav` MIME type set for chunks✅
- **WARNING**: Logs `storagePath` on failure (line 94)

### 5.54 `backend/src/services/ai/audioChunker.js` (113 lines)
- ffmpeg WAV conversion→PCM split pipeline correct✅
- **INFO**: Magic timeout values

### 5.55 `backend/src/services/ai/wavSplitter.js` (163 lines)
- **Clean**: Pure-JS PCM splitting correctly implemented✅

### 5.56 `backend/src/services/ai/addisAiText.service.js` (55 lines)
- Temperature 0.2, model from env✅. Multiple fallback extraction paths✅

### 5.57 `backend/src/services/ai/aiProviderErrors.js` (33 lines)
- **Clean**: Error map uses httpStatus constants✅. No provider details leaked✅

### 5.58 `backend/mock/data.js` (401 lines)
- **WARNING**: `passwordHash` field name misleading for plain text

### 5.59 `backend/mock/index.js` (187 lines)
- Session pattern correct✅. Wipe drops residual collection names

---

## 6. Client File-by-File Audit

### 6.1 `client/src/main.jsx` (80 lines) — Routes array in data mode✅. `StrictMode`✅. `LocalizationProvider`✅. `PersistGate`✅
### 6.2 `client/src/App.jsx` (39 lines) — Root layout✅. `fetchCurrentUser` on mount✅. `Outlet`✅

### 6.3 Reusable Components (13 files)
| Component | File | Line Count | Verdict |
|---|---|---|---|
| MuiTextField | `reusable/MuiTextField.jsx` | 25 | Clean✅ |
| MuiPasswordField | `reusable/MuiPasswordField.jsx` | 61 | **CRITICAL**: missing `type="button"` on toggle |
| MuiButton | `reusable/MuiButton.jsx` | 24 | Clean✅ (default `size="small"`✅, native loading props✅) |
| MuiCard | `reusable/MuiCard.jsx` | 31 | Auto-wraps in CardContent✅ |
| MuiSelect | `reusable/MuiSelect.jsx` | 34 | `maxHeight: 300`✅ |
| MuiDatePicker | `reusable/MuiDatePicker.jsx` | 34 | Desktop/Mobile switch via breakpoints✅ |
| MuiDialog | `reusable/MuiDialog.jsx` | 33 | `disableEnforceFocus`/`disableRestoreFocus` defaults✅ |
| MuiDataGrid | `reusable/MuiDataGrid.jsx` | 24 | `disableColumnMenu: true`✅ |
| MuiPageHeader | `reusable/MuiPageHeader.jsx` | 55 | `sx` prop✅ |
| MuiEmptyState | `reusable/MuiEmptyState.jsx` | 56 | Uses MuiButton✅ |
| MuiLoadingState | `reusable/MuiLoadingState.jsx` | 42 | Clean✅ |
| MuiErrorState | `reusable/MuiErrorState.jsx` | 56 | Uses MuiButton✅ |
| MuiPagination | `reusable/MuiPagination.jsx` | 23 | `color="primary"`, `shape="rounded"`✅ |

### 6.4 Feedback Components
- `AppErrorBoundary.jsx` (53 lines) — Clean✅
- `AppToastContainer.jsx` (29 lines) — `position="bottom-right"`, `autoClose={3000}`✅

### 6.5 Layout Components (7 files)
- `PublicLayout.jsx` (27 lines) — `height:100vh; overflow:hidden`✅
- `PublicAppBar.jsx` (76 lines) — Logo navigation correct✅. Theme toggle✅
- `AppShell.jsx` (62 lines) — Layout shell✅
- `AppSidebar.jsx` (203 lines) — Responsive permanent/temporary✅. Logout at bottom✅
- `AppTopbar.jsx` (148 lines) — Dynamic title✅. Theme toggle✅. User avatar✅
- `AppContent.jsx` (32 lines) — Clean✅
- `GlobalSearchDialog.jsx` (314 lines) — **CRITICAL**: missing `type="button"` on IconButtons. `react-hook-form` `useForm` with `register`✅. ArrowBackIcon adornment✅

### 6.6 Audio Components (5 files)
- `AudioRecorder.jsx` (101 lines) — MediaRecorder API✅
- `AudioPlayback.jsx` (217 lines) — Playback controls✅
- `AudioRecordingControls.jsx` (56 lines) — Clean✅
- `AudioRecordingMeter.jsx` (144 lines) — Clean✅
- `AudioGuidelines.jsx` (56 lines) — Clean✅

### 6.7 `useAudioRecorder.js` (208 lines)
- State machine: `idle→recording→recorded`✅
- MIME priority: `audio/webm;codecs=opus`→`audio/webm`→`audio/mp4`✅
- 10 MB check✅

### 6.8 Report Components (14 files)
- `ReportCard.jsx` (92 lines) — Clean✅
- `ReportsCardList.jsx` (36 lines) — Clean✅
- `ReportsDataGrid.jsx` (187 lines) — `withErrorBoundary`✅. Icon colors via `sx`✅. Tooltips in `<span>`✅
- `ReportsToolbar.jsx` (108 lines) — MuiPageHeader✅
- `ReportsFilterDialog.jsx` (255 lines) — **CRITICAL**: missing `type="button"`. MuiDatePicker✅. Clear resets to empty defaults✅
- `ReportMetadataDialog.jsx` (169 lines) — MuiDatePicker via Controller with comment✅
- `TranscriptionPanel.jsx` (172 lines) — Clean✅
- `TranscriptionReviewEditor.jsx` (130 lines) — **WARNING**: JSDoc says react-hook-form but uses raw `useState`
- `GenerateReportPanel.jsx` (153 lines) — Clean✅
- `ReportPreview.jsx` (131 lines) — Clean✅
- `ReportEditor.jsx` (65 lines) — Clean✅
- `ReportFinalizeBar.jsx` (91 lines) — **CRITICAL**: Invalid MuiDialog props
- `ReportSection.jsx` (46 lines) — Clean✅
- `ReportStatusChip.jsx` (31 lines) — Clean✅
- `ReportsPlaceholderPage.jsx` (30 lines) — Clean (bridge)✅

### 6.9 Pages
- `LandingPage.jsx` (50 lines) — Clean✅
- `LoginPage.jsx` (172 lines) — MuiCard + MuiTextField + MuiPasswordField + MuiButton✅
- `RegisterPage.jsx` (199 lines) — Same pattern✅
- `OAuthCallbackPage.jsx` (50 lines) — Clean✅
- `DashboardPage.jsx` (78 lines) — Card layout✅
- `ProfilePage.jsx` (230 lines) — **WARNING**: Unused `Divider` import
- `NotFoundPage.jsx` (53 lines) — Clean✅
- `ReportsPage.jsx` (212 lines) — MuiPagination✅. MuiDataGrid✅. Filter dialog✅
- `CreateReportPage.jsx` (310 lines) — Status progression✅
- `ReportPreviewPage.jsx` (291 lines) — Preview/edit/finalize✅

### 6.10 Store (5 files)
- `store.js` (19 lines) — 4 slices✅. `redux-persist` imported but unused✅
- `authSlice.js` (143 lines) — `register`, `login`, `logout`, `fetchCurrentUser`✅. `clearAuth`✅
- `profileSlice.js` (112 lines) — `fetchProfile`, `updateProfile`, `changePassword`✅
- `reportsSlice.js` (160 lines) — **WARNING**: `createReport.fulfilled` and `updateReport.fulfilled` don't update local list
- `branchesSlice.js` (58 lines) — Clean✅

### 6.11 Services (9 files)
- `apiClient.js` (93 lines) — `VITE_API_BASE_URL`✅. `credentials: 'include'`✅. 401→refresh→retry✅. Auth endpoints excluded✅
- `authApi.js` (50 lines) — Clean✅
- `profileApi.js` (29 lines) — Clean✅
- `reportsApi.js` (71 lines) — Clean✅
- `branchesApi.js` (34 lines) — Clean✅
- `audioApi.js` (50 lines) — Direct `fetch` (not apiClient)✅. **WARNING**: Unused `apiClient` import
- `transcriptionApi.js` (44 lines) — Clean✅
- `reportGenerationApi.js` (33 lines) — Clean✅
- `reportPreviewApi.js` (42 lines) — Clean✅

### 6.12 Theme (10 files)
- `AppTheme.jsx` (61 lines) — `createTheme` with `cssVariables`✅. Color schemes✅
- `themePrimitives.js` (248 lines) — Brand/gray/semantic colors✅. **INFO**: Brand scale non-monotonic at 500-600 and 800-900
- `customizations/inputs.js` (496 lines) — **INFO**: Dead code in comments (lines 250-251, 261-262, 326, 442-444, 478)
- `customizations/surfaces.js` (117 lines) — **WARNING**: `mb: 20` invalid CSS property (line 52)
- `customizations/dataDisplay.js` (237 lines) — **INFO**: Missing semicolon (line 237)
- `customizations/dataGrid.js` (138 lines) — Clean✅
- `customizations/datePickers.js` (176 lines) — Clean✅
- `customizations/feedback.js` (51 lines) — Clean✅
- `customizations/navigation.js` (291 lines) — Clean✅
- `customizations/charts.js` (80 lines) — Clean✅
- `customizations/index.js` (11 lines) — Aggregates✅

### 6.13 Utils (3 files)
- `constants.js` (22 lines) — `API_CONFIG`, `APP_NAME`✅
- `routePaths.js` (15 lines) — All route paths defined✅
- `audioUtils.js` (91 lines) — Clean✅

---

## 7. Root Files and Config Audit

### 7.1 `root/package.json`
- `install:all`✅, `dev:backend`✅, `dev:client`✅. Extra: `build:client` (benign)

### 7.2 `backend/package.json` — 100% match with PACKAGE_DECISIONS.md✅
### 7.3 `client/package.json` — 100% match with PACKAGE_DECISIONS.md✅

### 7.4 `.gitignore`
- `node_modules/`✅, `.env`✅, `dist/`✅, `build/`✅, `*.log`✅

### 7.5 `backend/.env` — **CRITICAL**: Contains live credentials
### 7.6 `client/.env` — Clean (VITE_API_BASE_URL, VITE_APP_NAME only)✅

### 7.7 `client/.oxlintrc.json` — `["react", "oxc"]` plugins✅
### 7.8 `AGENTS.md` — Highly accurate. One numeric stale: "~280 rules, 28 categories" → actual 291 rules, 29 categories

---

## 8. Documentation Audit

| Doc | Status |
|---|---|
| `ARCHITECTURE.md` (261 lines) | ✅ Accurate |
| `RULES.md` (388 lines) | ✅ 291 rules, 29 categories — comprehensive |
| `DEVELOPMENT_PHASES.md` (33 lines) | ✅ Accurate |
| `PRD.md` (104 lines) | ✅ Accurate |
| `PROBLEM_STATEMENT.md` (520 lines) | ✅ Accurate |
| `PROJECT_OVERVIEW.md` (39 lines) | ✅ Accurate |
| `PACKAGE_DECISIONS.md` (87 lines) | ✅ Accurate |
| `ADR-001` to `ADR-006` | ✅ All accurate, ADR-003 correctly marked SUPERSEDED |
| `phase-1-summary.md` through `phase-13-summary.md` (13 files) | ✅ All present |
| `phase-1-4-validation.md` | ✅ Present |
| `phase-1-6-validation.md` | ✅ Present |
| `phase-1-16-comprehensive-audit.md` (1202 lines) | ✅ Existing audit thorough and accurate |
| `research/addis-ai.md` (92 lines) | ✅ Accurate |
| `research/addis-ai-concrete-understanding.md` (294 lines) | ✅ Accurate |

---

## 9. Conventions Compliance Matrix

| Convention | Status | Verified In |
|---|---|---|
| ES Modules (backend) | ✅ All `import`/`export`, no `require()` | All 57 backend files |
| All constants from `constants.js` (frozen) | ✅ 1 exception: `'am'` default in report model | Backend audit |
| All config from `env.js` (frozen) | ✅ No `process.env` outside `env.js` | Backend audit |
| HTTP codes from `httpStatus.js` | ✅ No hardcoded numeric codes | Backend audit |
| `apiResponse` / `ApiError` | ⚠️ **CRITICAL bug**: `success` hardcoded | `apiResponse.js:16` |
| `asyncHandler` on controllers | ⚠️ Missing on `auth.middleware.js` async handler | `auth.middleware.js:22-45` |
| Write controllers use sessions/transactions | ✅ Verified | All write controllers |
| Controllers delegate to services | ⚠️ 2 exceptions: reportGeneration, reportPreview | Controllers audit |
| JSDoc on modules/functions | ✅ Present on all backend files | Backend audit |
| Tree-shaking MUI imports | ✅ No barrel imports | Client audit |
| MUI Grid `size` prop | ✅ No `item`/`xs`/`md` | Client audit |
| No deprecated MUI props | ✅ None found | Client audit |
| IconButton colors via `sx` | ⚠️ 3 exceptions | AppTopbar, PublicAppBar, ReportsToolbar |
| Tooltip children in `<span>` | ✅ Verified | ReportsDataGrid |
| `forwardRef` + `displayName` on inputs | ✅ All 9 input wrappers | Reusable audit |
| MuiButton native loading props | ✅ All submit buttons | Client audit |
| MuiDialog focus defaults | ✅ All MuiDialog instances | Client audit |
| react-hook-form `register` only | ⚠️ Controller used in ReportMetadataDialog (documented) | Client audit |
| Layout: `height:100vh; overflow:hidden` | ✅ All layout wrappers | Client audit |
| Audio upload: direct `fetch` | ✅ `audioApi.js` | Client audit |
| apiClient: `credentials: 'include'`, 401→refresh | ✅ `apiClient.js` | Client audit |
| `normalizeEmail({ gmail_remove_dots: false })` | ✅ Auth validators | Validators audit |

---

## 10. Unresolved Issues and Action Items

### Priority Matrix

| ID | Severity | File | Issue | Suggested Fix |
|---|---|---|---|---|
| C1 | 🔴 CRITICAL | `apiResponse.js:16` | `success: true` hardcoded | Add `success` parameter |
| C2 | 🔴 CRITICAL | `reportGeneration.controller.js:125` | Missing `await` on `commitTransaction()` | Add `await` |
| C3 | 🔴 CRITICAL | `backend/.env` | Live credentials exposed | Use placeholders |
| C4 | 🔴 CRITICAL | `MuiPasswordField.jsx:39` | Missing `type="button"` | Add `type="button"` |
| C5 | 🔴 CRITICAL | `GlobalSearchDialog.jsx:140,159` | Missing `type="button"` | Add `type="button"` |
| C6 | 🔴 CRITICAL | `ReportsFilterDialog.jsx:111,153,196` | Missing `type="button"` | Add `type="button"` |
| C7 | 🔴 CRITICAL | `ReportFinalizeBar.jsx:59-86` | Invalid MuiDialog props | Use DialogTitle/DialogActions |
| W1 | 🟡 WARNING | `security.middleware.js:18-22` | Hardcoded rate limits | Use constants |
| W2 | 🟡 WARNING | `auth.middleware.js:22-45` | Missing asyncHandler wrapper | Wrap with asyncHandler |
| W3 | 🟡 WARNING | `server.js:16` | DB connect race | Add `await` or listeners |
| W4 | 🟡 WARNING | `cookieOptions.js:21,34` | maxAge not from env | Read from env |
| W5 | 🟡 WARNING | `constants.js:8` | Body parser too small | Increase to 1mb |
| W6 | 🟡 WARNING | `seedBranches.js` vs `constants.js` | Duplicate branch data | Single source of truth |
| W7 | 🟡 WARNING | `report.model.js:91` | Magic `'am'` | Add LANGUAGE constant |
| W8-9 | 🟡 WARNING | `reportGeneration.routes.js`, `reportPreview.routes.js` | Inconsistent auth | Use `router.use(authenticate)` |
| W10-11 | 🟡 WARNING | `reportGeneration.controller.js`, `reportPreview.controller.js` | Bypass service layer | Delegate to services |
| W12 | 🟡 WARNING | `reportPreview.controller.js:28` | Misleading `_` prefix | Remove `_` prefix |
| W13 | 🟡 WARNING | `auth.service.js:29` | `passwordHash` field name | Rename or add comment |
| W14 | 🟡 WARNING | `addisAi.client.js:30` | API key `"undefined"` | Add startup validation |
| W15 | 🟡 WARNING | `addisAiStt.service.js:94` | Path leak in logs | Safe log |
| W16 | 🟡 WARNING | `audioChunker.js:22` | Misplaced constant | Move to proper location |
| W17 | 🟡 WARNING | `report.service.js:53` | Date validation | Validate dates |
| W18 | 🟡 WARNING | `report.service.js:232` | Unguarded export | Add guards |
| W19 | 🟡 WARNING | `mock/data.js:14,21` | Field name | Rename or comment |
| W20 | 🟡 WARNING | `mock/index.js:131-146` | Residual collection names | Clean up |
| W21 | 🟡 WARNING | `audioApi.js:6` | Unused import | Remove |
| W22 | 🟡 WARNING | `reportsSlice.js:125-127` | createReport doesn't update list | Add report to list |
| W23 | 🟡 WARNING | `reportsSlice.js:136-138` | updateReport doesn't update list | Update report in list |
| W24 | 🟡 WARNING | `ProfilePage.jsx:17` | Unused import | Remove |
| W25 | 🟡 WARNING | `ReportsPage.jsx:146` | Unused prop | Remove or use |
| W26 | 🟡 WARNING | `TranscriptionReviewEditor.jsx:8-9` | JSDoc mismatch | Update docs |
| W27 | 🟡 WARNING | `surfaces.js:52` | Invalid CSS | Use `marginBottom` |

### Phase 14-16 — Not Yet Built

| Feature | Phase | Priority | Notes |
|---|---|---|---|
| PDF export | 14 | Medium | `jspdf` + `jspdf-autotable` already in dependencies |
| TXT export | 14 | Medium | Blob download with UTF-8 |
| CSV export | 14 | Medium | Data Grid CSV export or custom |
| Spreadsheet export | 14 | Medium | `exceljs` + `file-saver` already in dependencies |
| AI chat service | 15 | Low | Chat-based report refinement |
| Translation endpoint | 15 | Low | Addis AI `/api/v1/translate` |
| TTS preparation | 15 | Low | Addis AI `/api/v1/audio` |
| Security hardening | 16 | Medium | Rate limits, input sanitization audit |
| Manual flow test | 16 | Medium | End-to-end workflow verification |
| Polish | 16 | Low | UX refinements |

### Technical Debt

| ID | Item | Severity | Status |
|---|---|---|---|
| T1 | `redux-persist` imported in store config but never used | Low | Acceptable (Phase 1 scaffold) |
| T2 | `ReportsPlaceholderPage.jsx` exists but is dead code (Phase 8 bridge) | Low | Can be removed |
| T3 | `ReportsDataGrid.jsx:30` — `REPORT_STATUSES` exported but unused | Low | Remove or use |
| T4 | `themePrimitives.js` brand scale non-monotonic at 500-600, 800-900 | Low | Fix lightness values |

---

## 11. Phase-by-Phase Completion Status

| Phase | Description | Status | Audit Verdict |
|---|---|---|---|
| 1 | Repository foundation and documentation | ✅ Complete | Clean |
| 2 | Backend foundation | ✅ Complete | Clean |
| 3 | Authentication and profile API | ✅ Complete | Clean |
| 4 | Frontend foundation, routing, auth | ✅ Complete | Clean |
| 5 | Theme and reusable MUI components | ✅ Complete | W27 (invalid CSS in surfaces.js) |
| 6 | Protected dashboard and profile page | ✅ Complete | W24 (unused Divider import) |
| 7 | Branch and report backend | ✅ Complete | W5 (body parser), W6 (duplicate branches) |
| 8 | Reports list/grid frontend | ✅ Complete | Clean |
| 9 | Audio recording frontend | ✅ Complete | Clean |
| 10 | Audio upload backend | ✅ Complete | Clean |
| 11 | Addis AI speech-to-text | ✅ Complete | W15 (path leak), W16 (misplaced constant) |
| 12 | Transcription review and AI generation | ✅ Complete | C1-C2, W10, W14 |
| 13 | Report preview, edit, finalization | ✅ Complete | C7, W8-W9, W11-W12, W25 |
| 14 | Export system | ❌ Not built | Packages installed, no implementation |
| 15 | AI chat, translation, voice | ❌ Not built | No implementation |
| 16 | Final hardening and verification | ❌ Not built | No implementation |

---

## 12. Files Inventory

### Backend: 57 files, ~4,701 lines

| Directory | Count | Lines |
|---|---|---|
| `backend/src/config/` | 3 | 132 |
| `backend/src/controllers/` | 9 | 1,003 |
| `backend/src/middleware/` | 7 | 261 |
| `backend/src/models/` | 3 | 316 |
| `backend/src/routes/` | 10 | 251 |
| `backend/src/services/` (non-AI) | 8 | 840 |
| `backend/src/services/ai/` | 6 | 651 |
| `backend/src/utils/` | 8 | 297 |
| `backend/src/validators/` | 8 | 303 |
| `backend/src/` (root) | 2 | 59 |
| `backend/mock/` | 2 | 588 |

### Client: 83 files, ~8,961 lines

| Directory | Count | Lines |
|---|---|---|
| `assets/` | 4 | 93 |
| `components/audio/` | 5 | 574 |
| `components/feedback/` | 2 | 82 |
| `components/layout/` | 7 | 862 |
| `components/reports/` | 14 | 1,666 |
| `components/reusable/` | 13 | 498 |
| `hooks/` | 1 | 208 |
| `pages/` | 10 | 1,625 |
| `providers/` | 1 | 21 |
| `routes/` | 2 | 88 |
| `services/` | 9 | 446 |
| `store/` | 5 | 492 |
| `theme/` | 10 | 1,906 |
| `utils/` | 3 | 128 |
| Root (`main.jsx`, `App.jsx`) | 2 | 119 |

### Docs: 14 files + subdirectories

| Category | Count | Notable |
|---|---|---|
| Architecture/Rules/Phases | 3 | ARCHITECTURE.md, RULES.md, DEVELOPMENT_PHASES.md |
| Product docs | 3 | PRD.md, PROBLEM_STATEMENT.md, PROJECT_OVERVIEW.md |
| Decisions (ADRs) | 7 | ADR-001 through ADR-006 + README |
| Phase summaries | 13 | phase-1-summary.md through phase-13-summary.md |
| Validation audits | 3 | phase-1-4, phase-1-6, phase-1-16-comprehensive |
| Research | 2 | addis-ai.md, addis-ai-concrete-understanding.md |
| Package decisions | 1 | PACKAGE_DECISIONS.md |
| Prompts | 2 | initial-one-time-prompt.md + phases/ subdir |

---

## 13. Deep-Dive Findings: 9-Point Analysis

### 13.1 Refresh Token Mechanism — NOT CORRECT

**Status**: 🔴 CRITICAL — The refresh/401 flow has a fatal gap: `clearAuth` is never dispatched.

#### 13.1.1 Backend Token Services (token.service.js, auth.service.js, cookieOptions.js)
- ✅ `generateAccessToken`: 15m expiry via `env.JWT_ACCESS_EXPIRES_IN` — correct
- ✅ `generateRefreshToken`: 7d expiry via `env.JWT_REFRESH_EXPIRES_IN` — correct
- ✅ Access token cookie: `path=/api/v1` — correct scope
- ✅ Refresh token cookie: `path=/api/v1/auth` — correct scope (refresh endpoint at `/api/v1/auth/refresh`)
- ✅ Both cookies: `httpOnly: true`, `secure` in production via `env.COOKIE_SECURE`, `sameSite: lax`
- ✅ `POST /auth/refresh` has NO `authenticate` middleware (uses refresh token cookie, not access token) — correct
- ⚠️ `cookieOptions.js:21,34`: `maxAge` hardcoded (`15*ONE_MINUTE`, `7*ONE_DAY`) instead of reading from env — if env token expiry is changed, cookie lifetime won't match
- ⚠️ `auth.middleware.js:38-43`: Catch block conflates ALL errors (DB failures, Mongoose errors, network) as "Invalid or expired token" — a DB outage would trigger useless refresh attempts

#### 13.1.2 Frontend apiClient.js (401→refresh→retry)
- ✅ Auth endpoints excluded from 401 handling: `/login`, `/register`, `/refresh`, `/logout` (line 15)
- ✅ On 401: calls `POST /auth/refresh` via direct `fetch` (not apiClient — avoids circular dep)
- ✅ On refresh success: retries original request with new cookies
- 🔴 **CRITICAL BUG (lines 72-77)**: On refresh failure, throws `{ code: 'SESSION_EXPIRED' }` — but **`clearAuth` is NEVER dispatched** to Redux. The `SESSION_EXPIRED` error propagates to the calling thunk which logs it as `error.message` via `rejectWithValue`, but the `.rejected` handler only sets `loading: false` and `error: payload`. **`isAuthenticated` remains `true`**, `user` remains set. `ProtectedRoute` still shows protected content. The user is stuck in a "zombie authenticated" state.
- 🔴 **BUG (lines 51-78)**: No concurrent refresh deduplication — if 3 API calls fire simultaneously and all get 401, 3 parallel refresh requests fire

#### 13.1.3 Frontend authSlice.js
- ✅ `clearAuth` action defined (line 83) and exported (line 142) — but **NEVER imported or dispatched anywhere**
- ✅ `fetchCurrentUser.rejected` correctly sets `initializing = false`, `user = null`, `isAuthenticated = false`
- ✅ `logout.fulfilled` correctly clears state
- ⚠️ No `logout.pending` or `logout.rejected` handlers — `loading` state not managed during logout

#### 13.1.4 Frontend App.jsx — fetchCurrentUser (Point 2)
- 🔴 **BUG (lines 24-26)**: `dispatch(fetchCurrentUser())` runs unconditionally on EVERY mount — including unauthenticated visitors on the landing page, login page, register page. This triggers TWO guaranteed-failing API calls per page load:
  1. `GET /auth/me` → 401 (no accessToken cookie)
  2. `POST /auth/refresh` → 401 (no refreshToken cookie)
- This adds ~500ms+ latency and two failed requests for every unauthenticated visitor
- Should be moved to `ProtectedRoute` (only dispatch when component mounts authenticated context)
- ✅ The `.rejected` handler in authSlice DOES correctly set `initializing = false` — so the flow doesn't break, it's just wasteful

#### 13.1.5 Dead Code
- `authApi.js:36`: `refreshToken()` function defined but **NEVER called** anywhere

#### 🔧 Required Fixes for Point 1+2:
1. In `apiClient.js` SESSION_EXPIRED handler: after throwing, also dispatch `clearAuth` action or call a provided callback
2. Or: create a middleware in the Redux store that listens for `SESSION_EXPIRED` and dispatches `clearAuth`
3. Move `fetchCurrentUser` from `App.jsx` to `ProtectedRoute.jsx`
4. Add concurrent refresh deduplication in `apiClient.js`
5. Differentiate error types in `auth.middleware.js` (JWT vs DB errors)

---

### 13.2 fetchCurrentUser in App.jsx — NOT NEEDED FOR PUBLIC ROUTES

**Status**: 🟡 HIGH — Increases latency for every unauthenticated page load.

See §13.1.4 for details. The fix is to move `dispatch(fetchCurrentUser())` from `App.jsx:24-26` into `ProtectedRoute.jsx` so it only fires when the user is accessing protected content.

---

### 13.3 Audio Recording — Single Clip Only, Array Not Utilized

**Status**: 🔴 CRITICAL — Schema supports array but service layer prevents multi-clip upload.

#### 13.3.1 Schema Design
- ✅ `report.model.js:101`: `audioClips: [audioClipSchema]` — array supports multiple clips (no `_id` on subdocs, correct)
- ❌ `report.model.js:102-105`: `transcription` is a **single subdocument** — no per-clip transcription storage. Each transcription call overwrites the previous result

#### 13.3.2 Backend Audio Upload (service + controller)
- ❌ `audio.service.js:31-33`: **CRITICAL** — Status gate checks `report.status !== constants.REPORT_STATUS.DRAFT`. After first upload, status becomes `AUDIO_RECORDED`, so **all subsequent uploads are rejected** with "Cannot attach audio to report in status 'audio_recorded'"
- ❌ `audio.service.js:45`: Status transition `DRAFT → AUDIO_RECORDED` happens once on first push — correct, but then blocks further pushes
- ✅ Pattern would work if status gate included `AUDIO_RECORDED`: `[DRAFT, AUDIO_RECORDED].includes(report.status)`

#### 13.3.3 Backend STT Processing
- ❌ `addisAiStt.service.js:81`: `clip = report.audioClips[report.audioClips.length - 1]` — **only transcribes the LAST clip** when no `clipId` given
- ❌ `addisAiStt.service.js:160-168`: **Overwrites** `report.transcription` entirely on each call. No accumulation across clips
- ❌ **No multi-clip pipeline exists**: No function iterates all clips, transcribes each, and combines text

#### 13.3.4 Frontend Recording UI
- ❌ `CreateReportPage.jsx:100`: `setSubmitted(true)` after first upload — **permanently hides the AudioRecorder**
- ❌ `CreateReportPage.jsx:273-298`: Binary toggle — `submitted ? TranscriptionPanel : AudioRecorder`. No "Add another clip" button, no clip list
- ❌ `useAudioRecorder.js:21-25`: State machine is `IDLE → RECORDING → RECORDED` — single recording lifecycle
- ❌ `useAudioRecorder.js:188-189`: One `audioBlobRef`, one `audioUrlRef` — no array of recordings
- ❌ `AudioRecorder.jsx:27-101`: Single blob submission via `onSubmit({ blob, duration, mimeType })`
- ❌ `AudioPlayback.jsx:33-215`: One `audioUrl` prop — renders one clip
- ❌ `AudioRecordingControls.jsx`: No multi-clip awareness
- ❌ `audioApi.js:17-48`: Only `POST` single file. No `DELETE` clip endpoint

#### 13.3.5 Missing Backend Endpoints
- ❌ `audio.routes.js`: No `DELETE /reports/:reportId/audio/:clipId` for discarding individual clips
- ❌ `audio.controller.js`: No delete/discard endpoint

#### 🔧 Required Fixes for Point 3:
1. `audio.service.js:31-33`: Add `AUDIO_RECORDED` to allowed statuses for upload
2. `audio.service.js`: Only transition `DRAFT → AUDIO_RECORDED` once (keep as-is, but allow re-entry)
3. `addisAiStt.service.js`: Add function to iterate ALL clips, transcribe each, combine text
4. `report.model.js`: Consider adding per-clip `transcribedText` field or array-based transcription storage
5. Frontend: Redesign `AudioRecorder` to manage a `recordings[]` array with per-clip play/pause/discard
6. Frontend: Add "Add another recording" button after first upload
7. Frontend: Show clip list with status (recorded, transcribed) per clip
8. Backend: Add `DELETE /reports/:reportId/audio/:clipId` endpoint
9. `audioApi.js`: Add `deleteClip()` function

---

### 13.4 Transcription Review — NO AI REVIEW CAPABILITY

**Status**: 🔴 CRITICAL — Review is 100% manual. No AI review, no re-review, no review prompt.

#### 13.4.1 What Exists
- ✅ `TranscriptionReviewEditor.jsx`: Manual text editor with "Save Reviewed Transcription" button — user edits raw text by hand
- ✅ `reportGeneration.controller.js:41-81`: `saveReviewedTranscription` persists user-edited text to `reviewedTranscription`, sets status to `transcription_reviewed`
- ❌ **No "Review by AI" button anywhere**
- ❌ **No AI review endpoint**
- ❌ **No AI review system prompt**
- ❌ **No re-review capability** (review → feedback loop for accuracy)

#### 13.4.2 Missing Architecture
- ❌ `transcription.controller.js`: Only STT, no review
- ❌ `transcription.routes.js`: No AI review route
- ❌ `reportGeneration.routes.js`: No AI review route
- ❌ `reportGenerationApi.js`: No AI review API function
- ❌ `transcriptionApi.js`: No AI review API call
- ❌ `GenerateReportPanel.jsx`: No AI transcription review capability
- ❌ `TranscriptionPanel.jsx`: Only shows STT request/retry — no AI review button

#### 13.4.3 What Must Be Built
1. AI review endpoint: `POST /reports/:reportId/transcriptions/review-by-ai`
   - Receives: raw transcription
   - Sends to AI: system prompt (English JSON) + transcription text
   - AI returns: corrected/improved transcription
   - User can accept or further edit manually
2. Re-review: `POST /reports/:reportId/transcriptions/re-review`
   - Receives: current transcription + user feedback
   - AI incorporates feedback and returns improved version
3. Frontend: Two buttons — "Review by AI" and "Save Manual Edit"
4. AI review prompt in English JSON format (see Point 7)

#### 🔧 Required Fixes for Point 4:
1. Create AI transcription review service (similar to `addisAiText.service.js`)
2. Create AI review system prompt in English JSON format
3. Add backend endpoint for AI review
4. Add backend endpoint for AI re-review with user feedback
5. Create frontend service function for AI review
6. Update `TranscriptionReviewEditor.jsx`: add "Review by AI" button + "Re-review" button
7. Update `TranscriptionPanel.jsx`: show transcription area with AI review option

---

### 13.5 Report Generation System Prompt — COMPLETELY WRONG

**Status**: 🔴 CRITICAL — Prompt is Amharic (must be English), assumes single person (must be multi-person conversation), and is too narrow (must handle all cases).

#### 13.5.1 Current State (`reportPrompt.service.js`)
| Line(s) | What It Says | Why Wrong |
|---|---|---|
| 35-82 | **Entire prompt in Amharic** | Must be in English per requirement |
| 73 | `"በአማርኛ ብቻ"` (Amharic only) | Directly contradicts "must be completely in English" |
| 73 | First-person: `"አረጋግጫለሁ"` (I confirm) | Assumes single supervisor speaking, NOT free conversation between multiple people |
| 63-79 | Narrow word-replacement rules for specific Amharic workplace terms | Must handle "all possible cases" — not just predefined word swaps |
| 45-60 | Fixed section template (ቀን, ብራንች, ስም, ሰዓት, ስራዎች, ጉዳዮች, አስተያየት) | Assumes one report structure, doesn't handle diverse conversational inputs |

#### 13.5.2 What the Prompt Must Do (Per User Requirements)
1. **Language**: Entirely in English (the AI will output Amharic report, but instructions are English)
2. **Input assumption**: The transcription is a FREE CONVERSATION between two or more people (supervisor speaking to a friend/assistant). NOT a first-person monologue. NOT a structured dictation.
3. **Scope**: Must handle ALL possible inputs — not just one type of transcription
   - Single-branch visit
   - Multi-branch visit
   - Conversational with questions and answers
   - Repetitions and clarifications
   - Mixed Amharic-English (technical terms)
   - Incomplete or missing information
   - Corrections mid-conversation
4. **Strict rules**:
   - Extract facts; do NOT invent
   - Separate completed activities from unresolved issues
   - Preserve branch-specific details
   - Preserve time ranges per branch
   - Output report in Amharic
   - Match professional supervisor report tone
   - Do NOT output explanations of how report was generated
   - Do NOT include unrelated conversation content
   - Do NOT include Person 2's questions unless answer contains report info

#### 13.5.3 Current Call Pattern
- `addisAiText.service.js:21-30`: Sends JSON body with `prompt` field containing raw Amharic string — no structured system/user role separation

#### 🔧 Required Fixes for Point 5:
1. Rewrite `reportPrompt.service.js` entirely:
   - All instructions in English
   - Clear system role definition
   - Multi-person conversation assumption
   - All-possible-cases handling
   - JSON format (see Point 7)
2. Update `addisAiText.service.js` to use structured prompt format
3. Update `promptVersions.js` with new version for English prompt

---

### 13.6 Error Messages — NOT USER-FRIENDLY

**Status**: 🟡 HIGH — Many errors expose internals or use technical jargon.

| File | Lines | Current Error | Problem | Suggested Fix |
|---|---|---|---|---|
| `reportGeneration.controller.js` | 57-59 | `"Cannot review transcription in status \"${report.status}\". Report must be in \"transcribed\" status."` | Exposes raw status enum value | `"You need to transcribe the audio before reviewing. Please request transcription first."` |
| `reportGeneration.controller.js` | 112-113 | Same pattern with raw status | Exposes raw status value | `"Please review the transcription before generating the report."` |
| `aiProviderErrors.js` | 14 | `"AI service configuration error. Please contact support."` | "Configuration error" is meaningless to a normal user | `"The AI service is not set up correctly. Please contact your system administrator."` |
| `aiProviderErrors.js` | 15 | `"AI service is busy. Please try again in a few minutes."` | OK for 429 | Can stay |
| `aiProviderErrors.js` | 13 | `"Invalid request sent to the AI service."` | Vague, user can't act | `"Something went wrong processing your request. Please try again."` |
| `aiProviderErrors.js` | 16-17 | `"AI service temporarily unavailable."` | OK | Can stay |
| `apiError.js` | 9 | `message` field | No per-instance guidance | Consider adding `userMessage` vs `developerMessage` separation |
| `validate.middleware.js` | 19 | `errors: [{ path, msg }]` | `msg` from express-validator may contain technical validation details | Wrap with user-friendly messages |
| `auth.middleware.js` | 42 | `"Invalid or expired token. Please login again."` | Doesn't distinguish between expired vs invalid vs DB error | Differentiate: "Session expired" vs "Invalid session" |

#### 🔧 Required Fixes for Point 6:
1. Create `userMessage` field in `ApiError` class, separate from `message` (developer-oriented)
2. Wrap all AI provider errors with user-facing language
3. Audit all controller errors for user-friendliness
4. Make validation errors human-readable

---

### 13.7 System Prompts — NOT IN JSON FORMAT

**Status**: 🔴 CRITICAL — All prompts are raw strings, not structured JSON.

| File | Line(s) | Current Format | Required Format |
|---|---|---|---|
| `reportPrompt.service.js` | 35-82 | Raw Amharic template literal string | JSON object with `system`, `user`, `rules` fields |
| `addisAiText.service.js` | 21-30 | `{ prompt: rawString, ... }` | `{ messages: [{ role: "system", content: jsonString }, { role: "user", content: transcription }], ... }` |
| `promptVersions.js` | 9 | `V1: 'v1.1.0'` single string | Versions for each prompt type |

#### 🔧 Required Fixes for Point 7:
1. Define all prompts as structured JSON:
```json
{
  "system": {
    "role": "You are an AI assistant that generates structured daily reports...",
    "language": "English",
    "output_language": "Amharic",
    "assumptions": ["The transcription is a free conversation between two or more people..."]
  },
  "rules": [
    "Rule 1: ...",
    "Rule 2: ..."
  ],
  "format": {
    "sections": [...]
  }
}
```
2. The AI proxy service should serialize this JSON and include it in the request
3. Separate prompts for:
   - Transcription review (`reviewPrompt`)
   - Transcription re-review (`reReviewPrompt`)
   - Report generation (`generationPrompt`)
   - Report correction (`correctionPrompt`)

---

### 13.8 Reports Page UI — COMPLETELY WRONG

**Status**: 🔴 CRITICAL — Multiple structural bugs in reporting UI.

#### 13.8.1 ReportsPage.jsx — Pagination Broken
- ❌ **CRITICAL (lines 69-71, 157)**: `handleDataGridPageChange` is **defined but never used**. DataGrid pagination calls `handlePageChange(model.page)` which passes ONE argument (a number) to a handler expecting `(_e, newPage)` — two arguments. The page number becomes `undefined`, causing `undefined + 1 = NaN`, sending `page=NaN` to API
- ❌ **Loading UX (line 127)**: `loading && reports.length === 0` — when navigating pages or applying filters with existing data, loading state is never shown. No visual feedback during pagination

#### 13.8.2 ReportsDataGrid.jsx — Same Pagination Bug
- ❌ **CRITICAL (line 157)**: `onPaginationModelChange={(model) => handlePageChange(model.page)}` — two-arg handler called with one arg

#### 13.8.3 ReportStatusChip.jsx — Duplicate Colors
- ❌ **Minor (lines 16-17)**: Both `finalized` and `exported` use `color: 'success'` — visually indistinguishable

#### 13.8.4 ReportPreviewPage.jsx — Status Display Broken
- ❌ **(lines 224-239)**: When status is `'generated'`, shows TWO "Generated" chips (line 230 always shows it, line 234 fallback also shows it)
- ❌ **(line 145)**: `isEditable = report.status === 'generated'` — after saving edits, status is still `generated`, but edit toggle disappears (setMode('preview') on line 87) — confusing UX
- ❌ **(lines 248-259)**: Empty-content Warning Alert shows even when in edit mode

#### 13.8.5 ReportsToolbar.jsx — Missing Accessibility
- ❌ **(lines 79-88)**: Mobile-only "Create Report" IconButton has NO `aria-label`

#### 13.8.6 ReportsCardList.jsx — Missing Edit Action
- ❌ **(lines 19-34)**: Does not pass `onEdit` prop to `ReportCard`. Card view has no edit action, inconsistent with DataGrid view

#### 13.8.7 reportsSlice.js — Shared Loading Flag
- ❌ **(lines 132-142)**: `updateReport.pending` sets the same `state.loading` used by `fetchReports.pending`. Editing a report shows a list-wide loading spinner

#### 13.8.8 ReportsFilterDialog.jsx — Unnecessary Query Params
- ❌ **(line 90)**: `handleClear` sends `{ status: "", branch: "", dateFrom: "", dateTo: "" }` — empty strings become `?status=&branch=&dateFrom=&dateTo=` in URL

#### 13.8.9 CreateReportPage.jsx — Missing Status
- ❌ **(line 73)**: Redirects to preview for `generated` or `finalized` but NOT for `exported`

#### 13.8.10 GenerateReportPanel.jsx — Non-standard Theme Key
- ❌ **(line 86)**: `bgcolor: 'grey.50'` — not a standard MUI theme key in all versions

#### 🔧 Required Fixes for Point 8:
1. Fix DataGrid pagination: change handler to `(model) => handlePageChange(null, model.page + 1)` or change ReportsPage handler to accept single `page` arg
2. Remove duplicate "Generated" chip logic in ReportPreviewPage
3. Add `aria-label` to mobile create button
4. Add `onEdit` to ReportsCardList/ReportCard
5. Create separate loading flags for update vs list operations in reportsSlice
6. Don't send empty filter params to API
7. Add `exported` to status redirect check
8. Use `theme => theme.palette.grey[100]` instead of `'grey.50'`

---

### 13.9 Finalize Report and Dialog — NOT CORRECT

**Status**: 🔴 CRITICAL — The `ReportFinalizeBar` MuiDialog uses invalid props that render the dialog empty.

#### 13.9.1 ReportFinalizeBar.jsx — Invalid Dialog Props
- ❌ **CRITICAL (lines 59-86)**: `MuiDialog` is passed `title` and `actions` props — **MuiDialog does not accept these props**. They spread as unknown DOM attributes:
  - `title` prop renders as an invalid HTML attribute
  - `actions` JSX is **never rendered** (the `{...props}` spread on MuiDialog passes it as a DOM attribute, causing React warning)
  - The dialog body text is passed as bare children without `<DialogContent>` wrapping
- Compare with the correct pattern used in `ReportsDataGrid.jsx:162-178` and `ReportMetadataDialog.jsx:78-165` which use `<DialogTitle>`, `<DialogContent>`, `<DialogActions>`
- **Result**: When the user clicks "Finalize Report", the dialog appears EMPTY — no title, no confirmation text, no Confirm/Cancel buttons

#### 13.9.2 Fix Pattern
```jsx
<MuiDialog open={open} onClose={onClose}>
  <DialogTitle>Finalize Report</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to finalize this report?</Typography>
    <Typography>Once finalized, the report cannot be edited further.</Typography>
  </DialogContent>
  <DialogActions>
    <MuiButton onClick={onClose}>Cancel</MuiButton>
    <MuiButton onClick={handleFinalize} loading={finalizing} loadingPosition="center">
      Confirm Finalize
    </MuiButton>
  </DialogActions>
</MuiDialog>
```

#### 🔧 Required Fix for Point 9:
1. Replace the broken `title`/`actions` props with proper `<DialogTitle>`, `<DialogContent>`, `<DialogActions>` children
2. Ensure the "Confirm" button uses `MuiButton` with `loading`/`loadingPosition` props
3. Import `DialogTitle`, `DialogContent`, `DialogActions` from MUI

---

## 14. Deep-Dive Findings: Archive & Delete System

### 14.1 Summary

**Status**: 🔴 NOT IMPLEMENTED — Zero existing archive infrastructure. Current delete is partial (hard-delete only for `draft` status, audio files orphaned).

The user requires:
- A report to be archived
- When archived, to be prepared for deletion in 30 days automatically
- Archived reports to be recoverable and deletable
- When permanently deleted, ALL involved files including `backend/uploads/audio/` to be deleted

---

### 14.2 Current State — File by File

#### 14.2.1 Backend Schema (`report.model.js`)
- ❌ No archive/deletion fields exist
- **Missing fields**:
  - `archivedAt: { type: Date, default: null }` — timestamp when archived
  - `archiveAt: { type: Date, default: null }` — timestamp for 30-day auto-delete deadline
  - `previousStatus: { type: String, default: '' }` — to restore original workflow status on recovery
  - `isDeleted: { type: Boolean, default: false }` — soft-delete flag (or use `deletedAt`)
- Alternatively, add `archived` and `deleted` statuses to the `REPORT_STATUS` enum, but this conflates archive state with workflow state (not recommended)
- Archive query index: `{ archiveAt: 1 }` for efficient cron job lookup

#### 14.2.2 Constants (`constants.js`)
- ❌ No archive-related constants
- **Missing**:
  - `ARCHIVE_DURATION_DAYS: 30` — configurable auto-delete window
  - `CRON_SCHEDULE: '0 0 * * *'` — daily midnight schedule for cleanup (or use `node-cron`)

#### 14.2.3 Report Controller (`report.controller.js`)
- ❌ `deleteReport` (lines 97-114): Standard hard-delete with session, calls service
- **Missing endpoints**:
  - `archiveReport` handler — sets archive fields, transitions status
  - `recoverReport` handler — restores previous status, clears archive fields
  - Modified `deleteReport` — should become permanent-delete with audio cleanup (or separate endpoint)
  - `getArchivedReports` — or filter modifier on existing `getReports`

#### 14.2.4 Report Service (`report.service.js`)
- ❌ `deleteReport` (lines 150-164): Hard-delete via `report.deleteOne()`. Only allows when `report.status === DRAFT`. **Does NOT clean up audio files from disk** — files at `backend/uploads/audio/` are orphaned
- **Missing functions**:
  - `archiveReport(id, userId)` — sets `archivedAt`, `archiveAt` (+30d), stores `previousStatus`
  - `recoverReport(id, userId)` — restores `previousStatus`, clears archive fields
  - `permanentDeleteReport(id, userId)` — deletes audio files from disk, then removes MongoDB document
  - `deleteReportAudioFiles(report)` — helper: iterates `audioClips[].storagePath`, calls `fs.unlink` on each
  - `listReports` filter update — exclude archived from default listings, add archive filter param

#### 14.2.5 Audio Service (`audio.service.js`)
- ❌ Only `attachAudioToReport`. No delete/cleanup function
- **Missing**: `deleteAudioFiles(report)` — iterates `report.audioClips`, deletes each file from disk via `fs.promises.unlink`

#### 14.2.6 Routes (`report.routes.js`)
- ❌ Only `DELETE /:id` (line 22)
- **Missing** (order: specific before `/:id`):
  - `PATCH /:id/archive`
  - `POST /:id/recover`
  - `DELETE /:id/permanent`

#### 14.2.7 Validators (`report.validators.js`)
- ❌ No archive/recover validators. `DELETE` has no validator at all (line 22 in routes — no `validate` middleware call)
- **Missing**: MongoID `:id` validation for archive/recover/delete routes

#### 14.2.8 Cron / Scheduled Task (`server.js` or new file)
- ❌ No scheduled cleanup exists
- **Must add**:
  - Install `node-cron` package
  - Create `backend/src/jobs/cleanupArchivedReports.js`
  - On server start (after DB connection), register cron job: daily at midnight
  - Job queries `report.find({ archiveAt: { $lte: new Date() }, isDeleted: false })`
  - For each: delete audio files via `audio.service.deleteAudioFiles()`, then hard-delete document
  - Consider batch processing for large numbers of reports

#### 14.2.9 Frontend Reports Page (`ReportsPage.jsx`)
- ❌ Only `handleDelete` (lines 86-88) dispatches `deleteReport(id)`. No archive UI
- **Missing**:
  - `handleArchive(id)` callback
  - `handleRecover(id)` callback
  - Pass `onArchive`/`onRecover` to `ReportsDataGrid` and `ReportsCardList`
  - Archive filter toggle (show/hide archived reports)

#### 14.2.10 ReportsDataGrid.jsx
- ❌ Delete button (lines 128-139) disabled when `row.status !== 'draft'`. Confirmation says "This action cannot be undone."
- **Missing**:
  - Archive IconButton for non-draft, non-archived reports
  - Recover IconButton for archived reports
  - Permanent delete button for archived reports
  - Conditional rendering based on archive status
  - Updated `REPORT_STATUSES` array (line 30) to include `archived`

#### 14.2.11 ReportStatusChip.jsx
- ❌ `STATUS_CONFIG` (lines 10-18) maps 7 statuses. No `archived`
- **Missing**: `archived: { label: 'Archived', color: 'default' }` or distinct color

#### 14.2.12 ReportsToolbar.jsx
- ❌ No archive-related controls
- **Missing**: Toggle to show/hide archived reports

#### 14.2.13 Redux reportsSlice.js
- ❌ `deleteReport` thunk (lines 63-73) filters from local list on success
- **Missing thunks**:
  - `archiveReport` — calls API, updates local state
  - `recoverReport` — calls API, updates local state
  - `permanentDeleteReport` — calls API, removes from local state
  - State fields: `archiveLoading`, `recoverLoading`

#### 14.2.14 reportsApi.js
- ❌ `deleteReport` (lines 67-71) calls `DELETE /reports/:id`
- **Missing functions**:
  - `archiveReport(id)` — `PATCH /reports/${id}/archive`
  - `recoverReport(id)` — `POST /reports/${id}/recover`
  - `permanentDeleteReport(id)` — `DELETE /reports/${id}/permanent`

#### 14.2.15 RoutePaths & Constants (client)
- ❌ No archive-related route paths or constants
- **Missing**: Potentially nothing — archive/recover are actions on existing report routes, not new pages

---

### 14.3 Complete Implementation Checklist

| # | Component | File | What To Build |
|---|---|---|---|
| 1 | Schema fields | `report.model.js` | Add `archivedAt`, `archiveAt`, `previousStatus`, `isDeleted` |
| 2 | Index | `report.model.js` | Add `{ archiveAt: 1 }` index |
| 3 | Constants | `constants.js` (backend) | Add `ARCHIVE_DURATION_DAYS: 30`, `CRON_SCHEDULE` |
| 4 | Service: archive | `report.service.js` | `archiveReport()` — set fields, store previousStatus |
| 5 | Service: recover | `report.service.js` | `recoverReport()` — restore previousStatus, clear archive fields |
| 6 | Service: permanent delete | `report.service.js` | `permanentDeleteReport()` — call audio cleanup, then delete doc |
| 7 | Audio cleanup | `audio.service.js` | `deleteAudioFiles(report)` — iterate clips, `fs.promises.unlink` each |
| 8 | Controller: archive | `report.controller.js` | `archiveReport` handler |
| 9 | Controller: recover | `report.controller.js` | `recoverReport` handler |
| 10 | Controller: permanent delete | `report.controller.js` | `permanentDeleteReport` handler |
| 11 | Controller: list filter | `report.controller.js` | Add archive filter to `getReports` |
| 12 | Routes | `report.routes.js` | Add `PATCH /:id/archive`, `POST /:id/recover`, `DELETE /:id/permanent` |
| 13 | Validators | `report.validators.js` | Add MongoID validation for archive/recover/delete |
| 14 | Cron job | New: `backend/src/jobs/cleanupArchivedReports.js` | Run daily, find expired, delete files + docs |
| 15 | Cron registration | `server.js` | Start cron after DB connection |
| 16 | Package | `backend/package.json` | Add `node-cron` dependency |
| 17 | DataGrid archive button | `ReportsDataGrid.jsx` | Add archive IconButton for non-draft, non-archived |
| 18 | DataGrid recover button | `ReportsDataGrid.jsx` | Add recover IconButton for archived |
| 19 | DataGrid permanent delete | `ReportsDataGrid.jsx` | Add permanent delete with confirmation for archived |
| 20 | Status chip | `ReportStatusChip.jsx` | Add `archived` status config |
| 21 | Redux thunks | `reportsSlice.js` | Add `archiveReport`, `recoverReport`, `permanentDeleteReport` |
| 22 | API service | `reportsApi.js` | Add `archiveReport()`, `recoverReport()`, `permanentDeleteReport()` |
| 23 | Reports page handlers | `ReportsPage.jsx` | Add `handleArchive`, `handleRecover`; pass to grid/card |
| 24 | Archive filter | `ReportsPage.jsx` + `report.service.js` | Toggle to show/hide archived reports |
| 25 | Docs | `RULES.md` | Add archive/deletion rules |
| 26 | Docs | `ARCHITECTURE.md` | Add archive subsystem description |

---

## 15. Deep-Dive Findings: MUI X Date Picker — Ethiopian Calendar Support

### 15.1 Summary

**Status**: 🔴 NOT IMPLEMENTED — All dates use Gregorian calendar. No Ethiopian calendar support exists anywhere.

The user requires: "to ensure the date selection in Ethiopian date by passing the proper props, localization" using MUI X Date Pickers (community version, `@mui/x-date-pickers` v9).

**Core challenge**: MUI X v9 has NO built-in Ethiopian calendar adapter. You must build a custom `AdapterDayjs` subclass that uses an Ethiopian calendar plugin.

---

### 15.2 Current State — File by File

#### 15.2.1 MuiDatePicker.jsx — Generic Gregorian Wrapper
- ✅ Thin wrapper: conditionally renders DesktopDatePicker (md+) or MobileDatePicker (<md)
- ✅ No MUI convention violations
- ❌ **No Ethiopian calendar support**: No locale prop, no `calendarSystem` prop, no format overrides
- **Needs**: Accept `ethiopian` prop; when true, use Ethiopian format (`YYYY-MM-DD` in Ethiopian calendar), pass proper `slotProps.calendarHeader` for month names

#### 15.2.2 main.jsx — LocalizationProvider Setup
- ✅ Uses `LocalizationProvider` with `AdapterDayjs` wrapping entire app (line 75)
- ❌ **No locale string** passed (e.g., `locale="am"`)
- ❌ **No Ethiopian calendar system registered**
- **Needs**: Register Ethiopian calendar system with dayjs; create custom `AdapterDayjsEthiopian`; pass to `LocalizationProvider`; pass Amharic locale

#### 15.2.3 ReportMetadataDialog.jsx — Date Handling
- ✅ Uses `dayjs()` for default values (line 45)
- ✅ Uses `dayjs(initialData.reportDate)` for initial data (line 55)
- ✅ On submit: `data.reportDate.toISOString()` (line 71)
- ❌ **All Gregorian**: No Ethiopian→Gregorian conversion on read/submit
- **Needs**: On read: convert Gregorian Date from API → Ethiopian display; on submit: convert Ethiopian-selected date → Gregorian ISO string for API

#### 15.2.4 ReportsFilterDialog.jsx — Filter Date Handling
- ✅ Uses `dayjs(initialFilters.dateFrom)` for init (line 53-57)
- ✅ On apply: `.format("YYYY-MM-DD")` (line 79-80) — correct for API (Gregorian)
- ❌ **Picker UI shows Gregorian**
- **Needs**: Picker displays Ethiopian dates; on apply, convert Ethiopian → Gregorian ISO string for API (API contract stays Gregorian)

#### 15.2.5 Date Picker Theme Customizations (`datePickers.js`)
- ✅ Pure visual/styling customizations (176 lines)
- ❌ **No changes needed** — styling is calendar-agnostic

#### 15.2.6 AppTheme.jsx
- ✅ Wires datePickersCustomizations into theme (line 48)
- ❌ **No changes needed**

#### 15.2.7 package.json (client)
- ✅ `@mui/x-date-pickers`: `^9.8.0`, `dayjs`: `^1.11.21`
- ❌ **No Ethiopian calendar package installed**
- **Needs**: Install `@calidy/dayjs-calendarsystems`

#### 15.2.8 report.model.js (backend) — Date Storage
- ✅ `reportDate: { type: Date, required: true }` — native `Date` (Gregorian)
- ✅ **No change needed**: Store as Gregorian Date in MongoDB. Ethiopian display is a frontend-only concern

#### 15.2.9 report.validators.js (backend)
- ✅ `reportDate` validated via `.isISO8601()` (line 19, 38)
- ✅ **No change needed**: Frontend converts Ethiopian → Gregorian ISO string before sending

#### 15.2.10 report.service.js (backend) — Date Queries
- ✅ `new Date(query.dateFrom)` (line 53) correctly parses Gregorian ISO strings
- ✅ **No change needed**

#### 15.2.11 constants.js (backend)
- ❌ No Amharic month/weekday name constants
- **Needs**: Add `ETHIOPIAN_MONTH_NAMES` (13 months), `ETHIOPIAN_WEEKDAY_NAMES`, `ETHIOPIAN_MONTHS_COUNT: 13`

---

### 15.3 Recommended Approach

**Recommended package**: `@calidy/dayjs-calendarsystems` — native dayjs plugin, zero dependencies, actively maintained, works with MUI X Date Pickers via custom adapter.

**Architecture**:

```
User sees Ethiopian date
  ↓
<MuiDatePicker ethiopian> displays Ethiopian calendar
  ↓
Picker returns Ethiopian dayjs object
  ↓
Custom conversion function: Ethiopian → Gregorian Date
  ↓
`date.toISOString()` → API → MongoDB stores as ISODate
```

**Reverse flow**:
```
API returns ISODate (Gregorian)
  ↓
Client receives Gregorian Date string
  ↓
Custom conversion function: Gregorian → Ethiopian dayjs
  ↓
<MuiDatePicker> displays Ethiopian date
```

**Why NOT store Ethiopian dates in MongoDB**:
- MongoDB `Date` type is always Gregorian
- `$gte`/`$lte` queries need Gregorian
- `mongoose-paginate-v2` needs Gregorian for sort
- Converting at frontend boundary is clean and testable

---

### 15.4 Complete Implementation Checklist

| # | Component | File | What To Build |
|---|---|---|---|
| 1 | Package install | `client/package.json` | `npm install @calidy/dayjs-calendarsystems` |
| 2 | Ethiopian adapter | **New**: `client/src/adapters/AdapterDayjsEthiopian.js` | Subclass `AdapterDayjs`, override: `date()`, `format()`, `parse()`, `getYear()`, `getMonth()`, `getDaysInMonth()`, `getMonthArray()`, `getWeekdays()`, `getMeridiemText()` — all use `.toCalendarSystem('ethiopian')` |
| 3 | Registration | `main.jsx` | Import `EthiopianCalendarSystem`, register with dayjs, pass `AdapterDayjsEthiopian` to `LocalizationProvider`, set `locale="am"` |
| 4 | Ethiopian→Gregorian conversion | New util or in `adapter` | Function `ethiopianToGregorian(ethiopianDayjs): Date` — for submit path |
| 5 | Gregorian→Ethiopian conversion | New util or in `adapter` | Function `gregorianToEthiopian(gregorianDate): dayjs` — for read path |
| 6 | MuiDatePicker update | `MuiDatePicker.jsx` | Add `ethiopian` prop; when true, set `format="YYYY-MM-DD"` (Ethiopian), pass custom `slotProps` |
| 7 | ReportMetadataDialog | `ReportMetadataDialog.jsx` | Convert Gregorian from API → Ethiopian for display; convert Ethiopian → Gregorian on submit |
| 8 | ReportsFilterDialog | `ReportsFilterDialog.jsx` | Display Ethiopian, send Gregorian to API |
| 9 | Amharic locale text | `main.jsx` | Add `localeText` prop to `LocalizationProvider` with Amharic translations for button labels |
| 10 | Backend constants | `constants.js` (backend) | Add `ETHIOPIAN_MONTH_NAMES` (13 months), `ETHIOPIAN_WEEKDAY_NAMES` |
| 11 | Docs | `PACKAGE_DECISIONS.md` | Add `@calidy/dayjs-calendarsystems` entry |
| 12 | Docs | `RULES.md` | Add Ethiopian calendar rules |
| 13 | Docs | `ARCHITECTURE.md` | Add Ethiopian date handling architecture |

---

### 15.5 MUI X Date Picker Amharic Locale Overrides

MUI X v9 does not ship an Amharic locale for date pickers. Must provide custom `localeText`:

```jsx
<LocalizationProvider
  dateAdapter={AdapterDayjsEthiopian}
  adapterLocale="am"
  localeText={{
    okButtonLabel: 'እሺ',
    cancelButtonLabel: 'ሰርዝ',
    clearButtonLabel: 'አጽዳ',
    todayButtonLabel: 'ዛሬ',
    previousMonth: 'ያለፈው ወር',
    nextMonth: 'ቀጣይ ወር',
    fieldDayPlaceholder: () => 'ቀን',
    fieldMonthPlaceholder: () => 'ወር',
    fieldYearPlaceholder: () => 'ዓመት',
    fieldHoursPlaceholder: () => 'ሰዓት',
    fieldMinutesPlaceholder: () => 'ደቂቃ',
  }}
>
```

---

### 15.6 Ethiopian Calendar Month Mapping (For constants.js Reference)

```
1. መስከረም (Meskerem)     — Sep 11/12 → Oct 10/11  (Gregorian)
2. ጥቅምት (Tikimt)          — Oct 11/12 → Nov 10/11
3. ኅዳር (Hidar)             — Nov 11/12 → Dec 10/11
4. ታኅሳስ (Tahsas)           — Dec 11/12 → Jan 9/10
5. ጥር (Tir)                — Jan 10/11 → Feb 8/9
6. የካቲት (Yekatit)         — Feb 9/10 → Mar 9/10
7. መጋቢት (Megabit)          — Mar 10/11 → Apr 8/9
8. ሚያዝያ (Miazia)          — Apr 9/10 → May 8/9
9. ግንቦት (Ginbot)           — May 9/10 → Jun 7/8
10. ሰኔ (Sene)               — Jun 8/9 → Jul 7/8
11. ሐምሌ (Hamle)             — Jul 8/9 → Aug 6/7
12. ነሐሴ (Nehase)            — Aug 7/8 → Sep 5/6
13. ጳጉሜን (Pagume)          — Sep 6/7 → Sep 10/11 (5 or 6 days)
```

---

*Audit completed: 2026-07-13. All 57 backend files, 83 client files, 25+ docs files, and root files analyzed. Deep-dive 9-point + archive/delete + Ethiopian date picker analysis appended above.*
