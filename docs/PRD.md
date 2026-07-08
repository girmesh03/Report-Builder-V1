# Product Requirements Document

## Product Vision

Report Builder V1 enables an area supervisor to produce daily branch-visit reports efficiently by recording activity audio, reviewing the transcription, and generating a structured report with AI assistance.

## Users

**Primary:** Area supervisor visiting 1+ branches per day.

**Secondary:** Boss/manager receiving reports; future admins managing branches and users.

## Workflow

1. **Authentication** — User registers or logs in via email/password or OAuth.
2. **Dashboard** — After login, user lands on the dashboard with summary stats and recent activity.
3. **Create Report** — User initiates a new report, selects branch(es) and date.
4. **Audio Recording** — User records a branch visit audio (≤10 MB).
5. **Transcription** — Backend sends audio to Addis AI STT; user reviews and edits the transcription.
6. **AI Generation** — Reviewed transcription is sent to Addis AI text model to produce a structured report.
7. **Review & Finalize** — User previews, edits, and finalizes the generated report.
8. **Export** — Report can be exported as PDF, TXT, CSV, or spreadsheet.

## Functional Requirements

### Public Experience
- Public landing page explaining the report-building purpose.
- Sign in and get started calls to action.
- Must feel like the actual application entry point.

### Authentication
- Email/password registration (name, email, password).
- Email/password login.
- OAuth support with extensible provider architecture.
- Secure password hashing (bcryptjs, pure-JS replacement for bcrypt).
- JWT-based auth, httpOnly cookie storage.
- Logout clears auth state.
- Profile page required.

### Dashboard
- Protected dashboard shell with sidebar navigation and top bar/user menu.
- Fully responsive: xs, sm, md, lg, xl.
- Navigation items: Reports, Profile.

### Reports
- List view (cards) and grid view (MUI Data Grid).
- Create report wizard.
- Report states: draft, audio_recorded, transcribed, transcription_reviewed, generated, finalized, exported.
- Report fields: title, supervisor, report date, branches visited, visit sequence/time, activities performed, observations/findings, issues/problems, actions taken, pending tasks/follow-up, recommendations, summary/conclusion.

### Audio Recording
- Browser-based audio recording with play, stop, discard, and re-record.
- Client-side and server-side validation.
- Enforce 10 MB file size limit. Duration is flexible — longer recordings produce larger files.
- Upload only on explicit user submission.

### Transcription
- Backend sends audio to Addis AI STT.
- Persist raw transcription, confidence, billed duration, request ID, language code, status.
- User reviews and edits transcription before AI processing.

### AI Report Generation
- Backend sends reviewed transcription plus structured prompt to Addis AI text generation.
- Prompt instructs model to extract facts, avoid fabrication, mark unclear items as unknown.
- Generated report persisted separately.
- Track model version and token usage.
- User previews and edits generated report.

### Export
- PDF via jspdf + jspdf-autotable.
- TXT via Blob download.
- CSV via MUI Data Grid CSV export or custom.
- Spreadsheet via exceljs + file-saver.
- UTF-8 encoding for Amharic text support.

## Non-Functional Requirements

- ES Modules only (backend).
- JavaScript only (frontend).
- MUI with tree-shaking imports, sx/styled theme, no Tailwind/TypeScript/Next.js.
- Responsive for all breakpoints.
- No hardcoded constants; centralized in constants.js.
- Safe logging: no raw audio, transcription, or reports in production logs.

## Security Requirements

- Addis AI keys stored only in backend environment variables.
- Backend proxy for all AI calls.
- AI endpoints protected by authentication.
- Rate limits on auth and AI endpoints.
- Audio file type, size, and duration validated.
- httpOnly cookies for auth tokens; secure cookies in production.
- Environment variables for all secrets; .env files never committed.
- `.env` files are committed with placeholder/default values for local development.

## Export Requirements

| Format     | Library                | Encoding |
|------------|------------------------|----------|
| PDF        | jspdf + autotable      | UTF-8    |
| TXT        | Blob download          | UTF-8    |
| CSV        | MUI Data Grid / custom | UTF-8    |
| Spreadsheet| exceljs + file-saver   | UTF-8    |
