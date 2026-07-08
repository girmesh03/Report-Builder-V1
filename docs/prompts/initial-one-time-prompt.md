# One-Time Initial Prompt

You are an expert MERN Stack development agent, product analyst, implementation planner, and AI integration engineer. You will build `Report-Builder-V1`, a production-minded MERN Stack application for daily branch supervision reports in Addis Ababa, Ethiopia.

## Absolute Startup Rule

Do not implement, scaffold, install packages, change Git branches, edit files, or create commits after receiving this one-time initial prompt. First, understand all product, technical, design, Git, and phase requirements below. Then stop and reply only with a readiness confirmation:

`I understand the Report-Builder-V1 requirements and am ready to receive Phase 1. I will not start implementation until the Phase 1 prompt is provided.`

## Product Vision

`Report-Builder-V1` helps an area supervisor quickly produce professional daily branch-visit reports. The supervisor works for a company with more than 14 branches in Addis Ababa, Ethiopia. Each day, the supervisor visits one or more branches and must prepare a report for a boss. Because the supervisor moves from branch to branch, writing the report at work is difficult; writing it at home every day is tiring. The app must turn recorded activity audio into a reviewed transcription and then into a structured daily report.

## Product Goals

- Reduce daily reporting effort.
- Capture activity details immediately through audio.
- Support Amharic Ethiopian language and English in audio, transcription, AI chat, and report content.
- Keep the application UI in English.
- Allow the user to review and correct transcription before AI report generation.
- Generate a structured report with an AI system prompt.
- Preview and export reports as PDF, TXT, CSV, and spreadsheet.
- Provide a secure full-stack foundation with authentication, protected pages, user profile, OAuth support, and MongoDB persistence.

## Users

Primary user:

- Area supervisor who visits one or more branches per day.

Secondary stakeholders:

- Boss/manager who receives reports.
- Future admins who may manage branches and users.

## Core Workflow

1. Public landing page.
2. Register/login/OAuth.
3. Protected dashboard.
4. Sidebar navigation.
5. Reports page.
6. Create report.
7. Select report date and branch/branches.
8. Record audio.
9. Stop, review audio, re-record if needed.
10. Submit audio.
11. Backend validates and forwards audio to Addis AI STT.
12. User reviews transcription.
13. User submits reviewed transcription to Addis AI text generation.
14. App previews generated report.
15. User edits if necessary.
16. User exports from report/grid context as PDF, TXT, CSV, and spreadsheet.

## Language Rules

- App shell, navigation, labels, buttons, validation messages, and helper text must be English.
- Audio can be Amharic, English, or mixed.
- Transcription can be Amharic, English, or mixed.
- AI chat can be Amharic, English, or mixed.
- Generated report can be Amharic, English, or mixed depending on user choice and source content.
- Do not force translation unless the user explicitly chooses it.

## Addis AI Concrete Integration Understanding

Use Addis AI through backend-only integration.

Official base URL:

`https://api.addisassistant.com`

Dashboard/playground:

`https://platform.addisassistant.com`

Authentication:

- API keys start with `sk_`.
- REST requests use `x-api-key` or `X-API-Key`.
- API keys must be stored only in backend environment variables.
- Never put `sk_` keys in frontend code, Vite env sent to browser, local storage, Redux state, or client logs.

Main text model:

`Addis-፩-አሌፍ`

Speech-to-text:

- Endpoint: `POST /api/v2/stt`
- Full URL: `https://api.addisassistant.com/api/v2/stt`
- Request type: `multipart/form-data`
- Fields:
  - `audio`: file
  - `request_data`: stringified JSON, for example `{ "language_code": "am" }`
- Response includes `status`, `data.transcription`, `data.usage_metadata.totalBilledDuration`, `data.usage_metadata.requestId`, and `confidence`.
- Supported formats: WAV, MP3, M4A, WebM.
- Recommended: WAV, 16kHz or higher, mono, quiet environment.
- Limits: max 60 seconds, max 10 MB.
- Optimized for single-speaker audio; overlapping voices can reduce quality.

Text generation:

- Endpoint: `POST /api/v1/chat_generate`
- Full URL: `https://api.addisassistant.com/api/v1/chat_generate`
- Request type for text: JSON.
- Important fields:
  - `model`
  - `prompt`
  - `target_language`
  - `conversation_history`
  - `generation_config.temperature`
  - `generation_config.maxOutputTokens`
  - `generation_config.topP`
  - `generation_config.topK`
- Response includes `response_text`, `finish_reason`, `usage_metadata`, and `modelVersion`.
- For report generation use low temperature, typically `0.2`.

Text-to-speech:

- Endpoint: `POST /api/v1/audio`
- Request type: JSON.
- Inputs include `text`, `language`, optional `voice_id`, optional `stream`.
- Response includes Base64 WAV audio.
- Not required for the first report-builder workflow but keep service architecture extensible.

Translation:

- Endpoint: `POST /api/v1/translate`
- Supports Amharic `am`, Afan Oromo `om`, and English `en`.
- Response nests translated text under `data.translation`.
- Optional for later. Do not translate reports by default.

Multimodal:

- Uses `POST /api/v1/chat_generate` with `multipart/form-data`.
- Can reason over audio or images.
- Do not use multimodal audio as the primary V1 flow because this product requires transcription review first.

Realtime:

- WebSocket relay: `wss://relay.addisassistant.com/ws?apiKey=<API_KEY>`.
- Do not expose secret keys in the browser.
- Realtime is future scope unless a later phase explicitly adds a secure backend-mediated design.

Errors:

- Addis AI error shape includes `status: "error"` and `error.code`, `error.message`, optional `error.param`.
- Handle `400`, `401`, `403`, `404`, `429`, `500`, and `503`.
- Use safe user-facing messages and internal logging without raw sensitive report content.

## Product Requirements Document

### Public Experience

- Landing page is public.
- It explains the report-building purpose clearly in English.
- It provides sign in and get started actions.
- It must feel like the actual application entry point, not a generic marketing page.

### Authentication

- Email/password registration with name, email, and password.
- Email/password login.
- Secure password hashing with `bcrypt`.
- JWT-based auth.
- Store auth token in httpOnly cookie when appropriate.
- Logout clears auth state.
- OAuth support is required. If final OAuth provider is unknown, implement extensible provider architecture and ask the user which provider to enable before requiring real credentials.
- Profile page is required.

### Dashboard

- Protected dashboard shell.
- Sidebar navigation.
- Top bar/user menu.
- Responsive layout for `xs`, `sm`, `md`, `lg`, `xl`.
- Reports navigation item.
- Profile navigation item.

### Reports

- Report list view with cards.
- Report grid view with MUI Data Grid.
- Create report workflow.
- Report states:
  - draft
  - audio_recorded
  - transcribed
  - transcription_reviewed
  - generated
  - finalized
  - exported
- Report fields should support:
  - title
  - supervisor
  - report date
  - branch/branches visited
  - visit sequence/time
  - activities performed
  - observations/findings
  - issues/problems
  - actions taken
  - pending tasks/follow-up
  - recommendations
  - summary/conclusion

### Audio

- User records audio in the browser.
- User can stop recording.
- User can play back the recording.
- User can discard and re-record before submission.
- Do not upload until the user explicitly submits.
- Validate client-side and server-side.
- Enforce 10 MB file size limit. Duration is flexible — longer recordings produce larger files.
- Prefer WebM in browser if MediaRecorder produces it, and allow backend to forward accepted formats.

### Transcription

- Backend sends audio to Addis AI STT.
- Persist raw transcription, confidence, billed duration, provider request ID, language code, and status.
- User reviews and can edit transcription.
- Report generation must use reviewed transcription, not unreviewed raw transcription.

### AI Report Generation

- Backend sends reviewed transcription plus structured report prompt to Addis AI text generation.
- Prompt must instruct the model to extract facts, avoid fabrication, preserve unclear items as unknown, and use a daily supervisor report structure.
- Generated report must be persisted separately from transcription.
- Track model version and token usage metadata.
- User previews and can edit generated report before final export.

### Export

- PDF export using `jspdf` and `jspdf-autotable`.
- TXT export using Blob download.
- CSV export using MUI Data Grid CSV export or safe custom CSV export.
- Spreadsheet export using `exceljs` and a download helper if no MUI X Premium license exists.
- Do not assume community `@mui/x-data-grid` provides Excel export.
- Export should preserve Amharic text correctly using UTF-8 where possible.

## Technical Architecture

Use this structure unless a phase prompt explicitly changes it:

- `backend/`
- `client/`
- `docs/`

Backend:

- Node.js with Express.
- MongoDB with Mongoose.
- MongoDB local connection compatible with MongoDB Compass.
- ES Modules only.
- No CommonJS.
- Native `fetch` where possible.
- Centralized config, constants, error handling, response helpers, validators, routes, controllers, services, and models.

Frontend:

- React with Vite.
- MUI.
- Redux Toolkit for app/auth/report state where useful.
- React Router.
- React Hook Form.
- JavaScript only.

## Package Requirements And Decisions

Backend initial packages:

`bcrypt compression cookie-parser cors dayjs dotenv express express-async-handler express-mongo-sanitize express-rate-limit express-validator helmet jsonwebtoken mongoose mongoose-paginate-v2 validator multer`

Backend dev packages:

`morgan nodemon`

Package notes:

- Do not install `cookie` unless a concrete need is documented.
- Use native Node `fetch`, `FormData`, and `Blob` for Addis AI where possible.
- If multipart forwarding from buffers fails due Node support, add a small helper package only after documenting why.
- OAuth packages depend on the chosen provider. Do not install provider-specific OAuth packages until the provider is selected or the phase explicitly requires one.

Client initial packages:

`@emotion/react @emotion/styled @fontsource/inter @mui/icons-material @mui/lab @mui/material @mui/x-charts @mui/x-data-grid @mui/x-date-pickers @reduxjs/toolkit dayjs jspdf jspdf-autotable react react-dom react-error-boundary react-hook-form react-redux react-router react-toastify redux-persist vite @vitejs/plugin-react exceljs file-saver`

Package notes:

- Do not install frontend `dotenv`; Vite already handles env variables prefixed with `VITE_`.
- Do not add Tailwind.
- Do not add TypeScript.
- Do not add Next.js.
- Do not add automated test frameworks.

## Backend Coding Rules

- ES Modules only.
- Use `asyncHandler(async (req, res, next) => { ... })` for all controllers.
- All controllers must pass errors to global error handler using `next(error)`.
- All write controllers must use `try`, `catch`, and `finally`.
- All write controllers must support MongoDB sessions/transactions where appropriate.
- All schema hooks, instance methods, and static methods must support session where relevant.
- Use `mongoose-paginate-v2` for pagination.
- Never combine `unique: true` on schema fields with separate indexes. Use `schema.index(...)`.
- Constants must live in `backend/src/utils/constants.js`.
- No hardcoded constants in controllers, services, models, routes, or middleware.
- Use `express-validator` for validation.
- Use `express-mongo-sanitize`.
- Use `express-rate-limit`.
- Use `helmet`, `cors`, `compression`, and `cookie-parser`.
- Use safe logging. Do not log raw audio, full transcription, or generated reports in production.
- Add JSDoc block comments for modules, functions, controllers, services, utilities, models, middleware, and route files.

## Frontend Coding Rules

- JavaScript only.
- React with MUI.
- MUI imports must be tree-shaking imports, for example `import Button from '@mui/material/Button';`.
- Do not use deprecated MUI props.
- Use MUI slots and `slotProps` where applicable.
- For MUI Grid, never use the old `item` prop. Use `size`, for example `<Grid size={{ xs: 12, md: 6 }}>`.
- Use MUI `sx`, `styled()`, and theme for styling.
- No Tailwind and no utility-class framework.
- No hardcoded theme values once theme is available.
- When theme phase begins, ask the user to place attached `theme/*` files into `client/src/theme/`.
- Reusable MUI components must be in `client/src/components/reusable/*`.
- Prefix reusable MUI component names with `Mui`, for example `MuiTextField.jsx`.
- Wrap input reusable components with `forwardRef`.
- All `MuiTextField` components default to `size="small"`.
- `MuiTextField` must support proper start and end adornments.
- Text input typing must not lag. Do not fix lag with `useDebounce`.
- Forms use `react-hook-form` with `...register`.
- Do not use React Hook Form `watch`.
- Do not use `Controller` unless impossible; if used, document why in a code comment.
- `MuiDialog` wrapper must pass/support `disableEnforceFocus` and `disableRestoreFocus`.
- If multi-step forms are used, mobile must use MUI Mobile Stepper.
- App must be responsive for `xs`, `sm`, `md`, `lg`, and `xl`.
- Add JSDoc block comments for modules, components, hooks, services, slices, utilities, and route definitions.

## Design Direction

- The app is an operational work tool, not a decorative marketing site.
- Use quiet, focused, professional UI.
- Prioritize fast daily reporting.
- Landing page should be clean but must quickly lead to authentication.
- Dashboard should emphasize reports, report status, and recent activity.
- Avoid oversized hero gimmicks, nested cards, decorative gradient blobs, and one-note color palettes.
- Use cards only for repeated items, dialogs, or tool surfaces.
- Use icons in buttons where useful.
- Text must not overflow or overlap at mobile or desktop widths.

## Security Requirements

- Keep Addis AI keys only on backend.
- Use backend proxy for all Addis AI calls.
- Protect AI endpoints with authentication.
- Apply rate limits to auth and AI endpoints.
- Validate uploaded audio type, size, duration metadata where available, and required request fields.
- Use httpOnly cookies for auth token when appropriate.
- Use secure cookies in production.
- Use environment variables for secrets.
- Do not commit `.env`.
- Provide `.env.example`.

## Required Environment Variables

Backend `.env.example` should include:

```text
NODE_ENV=development
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/report-builder-v1
JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
ADDIS_AI_BASE_URL=https://api.addisassistant.com
ADDIS_AI_API_KEY=sk_replace_me
ADDIS_AI_TEXT_MODEL=Addis-፩-አሌፍ
ADDIS_AI_DEFAULT_TARGET_LANGUAGE=am
ADDIS_AI_STT_LANGUAGE_CODE=am
ADDIS_AI_TIMEOUT_MS=60000
OAUTH_GOOGLE_CLIENT_ID=
OAUTH_GOOGLE_CLIENT_SECRET=
OAUTH_GOOGLE_CALLBACK_URL=http://localhost:4000/api/v1/auth/oauth/google/callback
```

Client `.env.example` should include:

```text
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_APP_NAME=Report Builder V1
```

## Data Models To Build Over Phases

User:

- name
- email
- passwordHash
- authProvider flags/accounts
- role
- avatar
- phone optional
- isActive
- lastLoginAt

Branch:

- name
- code
- address/area
- manager/contact optional
- isActive

Report:

- user
- reportDate
- title
- branches
- status
- languageMode
- audioClips
- transcription
- reviewedTranscription
- generatedReport
- editedReport
- export metadata

AiGeneration:

- report
- provider
- model
- prompt version
- input snapshot reference
- output
- usage metadata
- finish reason
- status

## Standard Daily Report Structure

Unless the user later provides an exact company template, use:

- Report title
- Supervisor name
- Report date
- Branches visited
- Visit sequence/time
- Activities performed
- Observations/findings
- Issues/problems
- Actions taken
- Pending tasks/follow-up
- Recommendations
- Summary/conclusion

Ask for the exact company report template before finalizing AI prompt/schema in the report-generation phase.

## Mandatory Phase Protocol

Every implementation phase must follow these six steps in order:

1. Pre-Git Requirement.
2. Comprehensive and extremely deep codebase analysis.
3. Comprehensive and extremely deep analysis of all previously implemented phases.
4. Phase execution without deviation.
5. User review and feedback integration.
6. Post-Git Requirement after explicit user approval only.

Step 6 must never be started without explicit approval from the user.

## Planned Phase Roadmap

1. Repository foundation and documentation.
2. Backend foundation.
3. Authentication and profile API.
4. Frontend foundation, routing, and auth pages.
5. Theme integration and reusable MUI components.
6. Protected dashboard shell and profile page.
7. Branch and report backend domain.
8. Reports list/grid frontend.
9. Audio recording frontend.
10. Audio upload backend and audio metadata.
11. Addis AI speech-to-text integration.
12. Transcription review and AI report generation.
13. Generated report preview, edit, and finalization.
14. Export system.
15. AI chat, translation-ready service layer, and optional voice service preparation.
16. Final hardening and manual verification.

## Final Startup Instruction

After reading this initial prompt, stop. Confirm readiness for Phase 1 only. Do not implement anything until Phase 1 is provided.
