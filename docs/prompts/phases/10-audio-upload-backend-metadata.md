# Phase 10 - Audio Upload Backend And Metadata

## Phase Goal

Implement authenticated backend audio upload endpoints and report audio metadata persistence. This phase receives audio from the browser, validates it, stores metadata, and associates it with a report. It does not call Addis AI STT yet.

## Mandatory Phase Protocol

### Step 1: Pre-Git Requirement

Run `git status`, `git branch -vv`, and `git fetch origin`. Handle missing remote, uncommitted changes, behind branches, and conflicts exactly as required. Create `phase-10-audio-upload-backend-metadata`. Verify state before implementation.

### Step 2: Comprehensive And Extremely Deep Codebase Analysis

Read backend report model, controllers, services, auth middleware, constants, docs, frontend audio recording output shape, and previous phase summaries.

### Step 3: Comprehensive And Extremely Deep Analysis Of Previously Implemented All Phases

Analyze Phases 1-9. Ensure backend upload API matches frontend recorder output and report state transitions.

### Step 4: Phase Execution Without Deviation

Implement backend upload and metadata only.

Required files:

```text
backend/src/middleware/upload.middleware.js
backend/src/controllers/audio.controller.js
backend/src/routes/audio.routes.js
backend/src/services/audio.service.js
backend/src/validators/audio.validators.js
backend/src/utils/fileValidation.js
```

Route:

- `POST /api/v1/reports/:reportId/audio`

Behavior:

- Protected route.
- Ensure report exists and belongs to authenticated user.
- Accept one audio file with field name `audio`.
- Accept metadata fields if needed:
  - `durationSeconds`
  - `mimeType`
  - `recordedAt`
  - `languageCode`
- Validate:
  - file required
  - max 10 MB
  - no hard duration limit — per ADR-005, duration metadata is informational only; long recordings chunked by backend at STT time
  - allowed MIME types:
    - `audio/wav`
    - `audio/x-wav`
    - `audio/wave`
    - `audio/mpeg`
    - `audio/mp3`
    - `audio/mp4`
    - `audio/x-m4a`
    - `audio/webm`
- Use `multer`.
- Store audio temporarily on disk or in memory according to project decision. For V1 local development, prefer a clear local storage path under `backend/uploads/audio/` with `.gitignore`, unless direct-to-provider streaming is chosen in Phase 11.
- Do not commit uploaded files.
- Persist metadata in report `audioClips`.
- Update report status to `audio_recorded`.
- Return report summary and audio clip metadata.

Controller rules:

- `asyncHandler(async (req, res, next) => { ... })`.
- Pass errors with `next(error)`.
- Write controller uses `try`, `catch`, and `finally`.
- Use MongoDB session.
- Clean up uploaded file in `finally` if a DB error occurs after storage.

Security:

- Do not log raw audio.
- Do not expose local filesystem paths directly to client.
- Rate-limit upload route if appropriate.
- Use constants from `backend/src/utils/constants.js`.

Frontend integration:

- Add `client/src/services/audioApi.js`.
- Wire Create Report page submit recording to upload endpoint.
- After successful upload, show submitted state and next-step placeholder for transcription.
- Keep UI English.

Update docs:

- `docs/phases/phase-10-summary.md`
- Update architecture audio storage section.

Manual verification:

- Upload valid audio.
- Reject invalid MIME.
- Reject over-limit size. Duration metadata is informational — no hard duration limit.
- Verify report status changes.

### Step 5: User Review And Feedback Integration

Present endpoint, storage decision, validations, frontend upload behavior, and manual verification. Ask for explicit approval before Step 6.

### Step 6: Post-Git Requirement

After explicit approval only, complete Git status/fetch/diff/stage/commit/push/merge/delete/verify using commit message `feat: phase 10 audio upload backend and metadata`.

## Phase Completion Criteria

- Audio upload endpoint works.
- Report audio metadata persists.
- Upload validation enforces Addis AI documented limits.
- Frontend can submit recorded audio.
