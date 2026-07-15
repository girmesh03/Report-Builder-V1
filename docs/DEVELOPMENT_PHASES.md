# Development Phases

## Phase Roadmap

| #  | Phase                                  | Scope                                                    |
|----|----------------------------------------|----------------------------------------------------------|
| 1  | Repository foundation and documentation| Git setup, env examples, package.json, docs, gitignore    |
| 2  | Backend foundation                     | Express server, Mongoose connection, config, middleware   |
| 3  | Authentication and profile API         | User model, auth routes, JWT, OAuth, profile endpoints   |
| 4  | Frontend foundation, routing, auth     | React Router data mode, Redux Toolkit auth, apiClient with 401→refresh, reusable MUI wrappers (MuiTextField, MuiPasswordField, MuiButton, MuiCard), PublicAppBar + scrollable layout, auth/landing/404 pages, ProtectedRoute guard |
| 5  | Theme and reusable MUI components      | 8 MUI wrappers created (MuiSelect, MuiDatePicker, MuiDialog, MuiDataGrid, MuiPageHeader, MuiEmptyState, MuiLoadingState, MuiErrorState); AppThemeProvider created; LocalizationProvider with AdapterDayjs in main.jsx; MuiButton uses native MUI loading props; audit-driven fixes across backend (apiResponse, env, googleOAuth route, graceful shutdown mongoose disconnect) and client (ProtectedRoute state.from, centralized API_CONFIG, JSDoc, @file→@module) |
| 6  | Protected dashboard and profile page   | AppShell, AppSidebar (responsive, logout at bottom), AppTopbar (dynamic page title + user menu), AppContent, DashboardPage (summary cards), ProfilePage (personal info + change password), ReportsPlaceholderPage, profileApi/profileSlice, PublicRoute guard (redirects authenticated users from public auth pages), logo navigates to /dashboard if authenticated |
| 7  | Branch and report backend              | Branch + Report models (branch name enum from BRANCH_NAMES, 14 Amharic names; area→branch rename), CRUD endpoints, pagination, validators, services, routes, mock data inject/wipe script, monthly report compilation endpoint (`GET /api/v1/reports/monthly`), date-range export endpoint (`GET /api/v1/reports/export`), TASK_STATUS constant. Phase 7 audit fixed 5 violations: broken status refs in report.service, hardcoded GENERAL_RATE_LIMIT, dead REPORT.TITLE_* constants, profile.controller delegation violation, unused validator package. Post-audit cleanup: 21+ additional violations fixed across 9+ files (unused imports, JSDoc params, unused params, removed dead oauthAccount.model, removed unused logger.debug) |
| 8  | Reports list/grid frontend             | Report list cards (Responsive grid), MUI Data Grid (server pagination), search, status/date filters, create report dialog with date/branch(es)/notes, post-create scaffold page. ✅ Implemented |
| 9  | Audio recording frontend               | MediaRecorder, playback, discard, submit UI              | ✅ Implemented |
| 10 | Audio upload backend                   | Multer, validation, audio metadata storage               | ✅ Implemented |
| 11 | Addis AI speech-to-text integration    | STT service, transcription persistence, chunked audio processing (ffmpeg WAV → PCM split), re-transcription for accuracy testing. **Accuracy-critical:** Correct chunk MIME type (`audio/wav`) is mandatory. See RULES.md rules 13.21-13.25 | ✅ Implemented |
| 12 | Transcription review and AI generation | Review UI, text generation service, report generation                    | ✅ Implemented |
| 13 | Report preview, edit, finalization     | Read-only preview route (`/reports/:id/preview`), full edit route (`/reports/:id/edit`), expanded status transitions (transcribed/transcription_reviewed/generated/finalized allowed for audio upload, transcribe, review, generate), audio clip delete cascades transcription+gneratedReport reset, inline editing of reviewed transcription at any stage including finalized, cascade-reset of transcription on re-upload, Regenerate button, responsive TranscriptionReviewEditor button layout | ✅ Implemented |
| 14 | Export system                          | PDF, TXT, CSV, spreadsheet exports                       |
| 15 | AI chat, translation, voice services   | Chat service, translate endpoint, TTS preparation        |
| 16 | Final hardening and verification       | Security audit, manual flow test, polish                 |

## Phase Protocol

Every phase follows six steps in order:

1. **Pre-Git Requirement** — check status, create feature branch.
2. **Comprehensive codebase analysis** — understand existing code.
3. **Analysis of all previous phases** — review prior work.
4. **Phase execution** — implement without deviation.
5. **User review and feedback** — present changes, get approval.
6. **Post-Git Requirement** — commit, merge, clean up (only after approval).
