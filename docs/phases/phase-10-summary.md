# Phase 10 — Audio Upload Backend And Metadata

## Summary

Implemented authenticated backend audio upload endpoints and report audio metadata persistence. Audio is received from the browser, validated, stored temporarily on disk, and associated with a report. Report status advances from `draft` to `audio_recorded`.

## Files Created

### `backend/src/utils/fileValidation.js`
- `ALLOWED_AUDIO_MIME_TYPES` — 8 types: wav, mp3, mp4, webm, m4a
- `MAX_AUDIO_SIZE` — 10 MB
- Duration metadata accepted as informational — no hard duration limit on upload (ADR-005)
- `isAllowedAudioMime(mimeType)`, `isValidAudioSize(bytes)`

### `backend/src/middleware/upload.middleware.js`
- Multer disk storage to `backend/uploads/audio/` with UUID filenames
- File filter rejects unsupported MIME types (returns ApiError 400)
- File size limited to 10 MB

### `backend/src/services/audio.service.js`
- `attachAudioToReport()` — validates report ownership/status, pushes audioClip, sets status to `audio_recorded`

### `backend/src/controllers/audio.controller.js`
- `uploadAudio` — asyncHandler-wrapped, validates file presence, stores duration metadata, uses MongoDB session, cleans up file on error

### `backend/src/validators/audio.validators.js`
- `uploadAudioRules` — optional metadata validation (durationSeconds min:0, mimeType regex, recordedAt string, languageCode 2-10 chars)

### `backend/src/routes/audio.routes.js`
- `POST /reports/:reportId/audio` — authenticated, multer single('audio'), validated, controller

### `client/src/services/audioApi.js`
- `uploadAudio(reportId, blob, metadata)` — FormData POST to backend

### `backend/uploads/.gitignore`
- Ignores all uploaded audio files (keeps only .gitignore)

## Files Modified

- `backend/src/routes/index.js` — mounted audio routes at `/reports/:reportId/audio`
- `client/src/components/audio/AudioRecorder.jsx` — passes `{ blob, duration, mimeType }` to onSubmit; accepts `disabled` prop
- `client/src/pages/reports/CreateReportPage.jsx` — wires submit to `uploadAudio` API with loading state

## Route

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/reports/:reportId/audio` | Authenticated | Upload audio file + metadata |

## Key Design Decisions

- **Disk storage**: Audio stored in `backend/uploads/audio/` with UUID filenames. Not committed (gitignored). Ready for cleanup or direct upload in Phase 11.
- **Multer over custom parser**: Project already had multer in dependencies. Disk storage preferred over memory for large audio files.
- **Session on write**: Upload uses `try/catch/finally` with MongoDB session. File cleaned up on error in `finally` block.
- **Status guard**: Only `draft` reports accept audio upload.
- **No hard duration limit**: Per ADR-005, no fixed duration limit on upload. Duration metadata is informational. Long recordings are chunked by the STT service at transcription time (WAV only; other formats sent as-is).

## Alignment with Documentation

- ADR-005: ✅ Transient state, MIME priority, 10 MB limit
- ARCHITECTURE.md: ✅ Audio upload route, multer middleware, service layer
- RULES.md: ✅ Sections 13 (Multer for audio), 22 (ADR-005), 18 (safe logging)
- PRD.md: ✅ Audio file type and size validated, duration metadata informational
- PROBLEM_STATEMENT.md: ✅ Steps 4 (submit audio)
- DEVELOPMENT_PHASES.md: ✅ Phase 10 scope delivered
- initial-one-time-prompt.md: ✅ Validate uploaded audio type, size, duration metadata
- PACKAGE_DECISIONS.md: ✅ Multer for multipart file upload (audio)

## Manual Verification Checklist

- [ ] Upload valid audio (.wav) to a draft report → 200, status changes to `audio_recorded`, clip metadata returned
- [ ] Upload unsupported MIME (.png) → 400 "Unsupported audio format"
- [ ] Upload over 10 MB → 400 (Multer file size error)
- [ ] Upload to non-existent report → 404
- [ ] Upload to non-draft report → 400
- [ ] Upload without auth → 401
- [ ] Upload without file → 400 "Audio file is required"
- [ ] Verify file appears in `backend/uploads/audio/`
- [ ] Verify `.gitignore` prevents upload commit
