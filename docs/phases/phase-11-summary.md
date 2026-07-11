# Phase 11 — Addis AI Speech-to-Text Integration

## Summary

Integrated Addis AI STT through the backend proxy. Uploaded audio clips are forwarded to Addis AI for Amharic speech-to-text transcription. Transcription metadata (text, confidence, request ID, billed duration, language code, status) is persisted in the report. Report status advances from `audio_recorded` to `transcribed`.

## Files Created

### Backend — `backend/src/services/ai/`

#### `aiProviderErrors.js`
- Maps Addis AI HTTP status codes (400, 401, 403, 404, 429, 500, 503) to user-safe messages
- 401/403 → "service configuration error"
- 429 → "service busy, try again later"
- 500/503 → "service temporarily unavailable"
- All other codes → generic error message

#### `addisAi.client.js`
- Base HTTP client using native Node `fetch`, `AbortController` for timeout
- Sets `x-api-key` header from `env.ADDIS_AI_API_KEY`
- Timeout from `env.ADDIS_AI_TIMEOUT_MS` (60s default)
- Parses provider error responses, logs provider status/request ID/error code
- Never logs raw transcription or audio content

#### `addisAiStt.service.js`
- `transcribeAudio()` — reads audio file from disk via `fs.promises.readFile`
- For audio files exceeding Addis AI's per-request duration limit (60s), the file is first converted to WAV via ffmpeg (one clean pass, 16kHz mono PCM), then split into 60s chunks at exact PCM byte boundaries via `wavSplitter.js`. Each chunk is transcribed independently. Results are concatenated in order. This avoids Opus decoder priming artifacts from per-segment re-encoding.
- Creates `FormData` with audio `Blob` and `request_data` (`{ language_code }`), posts to `/api/v2/stt`
- Validates report ownership and status (`audio_recorded` required)
- Uses latest clip by default, or specified `clipId`
- On provider error: persists failed transcription with chunk-aware error message, re-throws
- On success: persists transcription text/confidence/requestId/billedDuration/languageCode, sets status to `transcribed`
- Safe logging: logs provider request IDs and metadata, not raw transcription

### Backend — Other

#### `backend/src/controllers/transcription.controller.js`
- `requestTranscription` — asyncHandler-wrapped, MongoDB session for write, delegates to `transcribeAudio` service
- Standard pattern: try/catch/finally with `session.startTransaction()`/`commitTransaction()`/`abortTransaction()`

#### `backend/src/validators/transcription.validators.js`
- `requestTranscriptionRules` — optional `clipId` (MongoID) body validation

#### `backend/src/routes/transcription.routes.js`
- `POST /reports/:reportId/transcriptions` — authenticated, validated, controller

### Frontend

#### `client/src/services/transcriptionApi.js`
- `requestTranscription(reportId, options)` — POST to backend
- `getTranscriptionInfo(report)` — helper to extract transcription data from report object

#### `client/src/components/reports/TranscriptionPanel.jsx`
- Three states: ready (show "Request Transcription" button), transcribing (loading spinner + progress bar), complete (show raw text, confidence %, billed duration, language code)
- Error state with retry button
- Calls `onTranscriptionComplete` callback when done
- UI shows clear next step: review/edit in Phase 12

## Files Modified

| File | Change |
|---|---|
| `backend/src/routes/index.js` | Mounted transcription routes at `/reports/:reportId/transcriptions` |
| `backend/src/controllers/audio.controller.js` | Removed client-side duration check (defer to server chunking) |
| `backend/src/validators/audio.validators.js` | Removed `max: 60` on `durationSeconds` |
| `backend/src/utils/fileValidation.js` | Removed `MAX_AUDIO_DURATION` / `isValidAudioDuration` |
| `client/src/pages/reports/CreateReportPage.jsx` | Added `TranscriptionPanel` after audio upload; tracks `transcribed` state; shows success/transcription/info cards |
| `client/src/services/audioApi.js` | Defensive error handling for non-array `err.data` |

## Route

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/reports/:reportId/transcriptions` | Authenticated | Request STT transcription for uploaded audio |

## Key Design Decisions

- **Native Node APIs**: Uses native `fetch`, `FormData`, `Blob`, `AbortController` — no additional packages needed
- **Timeout handling**: Uses `AbortController` with `ADDIS_AI_TIMEOUT_MS` (60s default); timeout mapped to 503
- **Error mapping per the prompt**: 401/403 → internal server error (config issue), 429 → too many requests (busy), 500/503 → internal server error (unavailable)
- **Safe logging**: Only provider request IDs, error codes, and metadata logged. Not raw audio, not raw transcription in production
- **Report status guard**: Accepts `audio_recorded` AND `transcribed` (re-transcription for accuracy testing). Rejected statuses: all others.
- **Clip selection**: Uses latest clip by default; optional `clipId` for specific clip
- **Failed transcription persisted**: On provider error, report transcription status set to `failed` with chunk-aware error message. No MongoDB transaction needed — single-document update.
- **Format-agnostic chunking**: Long recordings of any format are converted to WAV via ffmpeg then split at PCM level. Each chunk gets a fresh RIFF/WAVE header; results concatenated.
- **Correct MIME type per chunk**: After ffmpeg WAV conversion, chunks are pure WAV (pcm_s16le, 16kHz, mono). The Blob `type` is set to `audio/wav` by detecting the `RIFF` signature — critical for accuracy.
- **Re-transcription**: The backend allows re-transcription when status is `transcribed`. The frontend shows a "Re-transcribe" button on completed transcription. This enables accuracy testing across multiple attempts.
- **Transcription accuracy is the highest priority quality metric**: Rules 13.21-13.25 in RULES.md codify the accuracy requirements. Any change that degrades accuracy is a blocking defect.

## Alignment with Documentation

- RULES.md: ✅ 13.1 (backend-only proxy), 13.2 (keys backend-only), 13.3 (AI endpoint auth), 13.5 (STT endpoint, multipart), 13.9 (audio formats), 13.19 (cleanup), 18.8 (safe logging)
- PROBLEM_STATEMENT.md: ✅ Steps 10-11 (transcribe audio, review transcription)
- PRD.md: ✅ Backend STT, persistence, user reviews before AI processing
- ARCHITECTURE.md: ✅ AI provider services, proxy pattern
- ADR-005: ✅ Transient audio state, chunked STT prepared
- Phase 11 prompt: ✅ All requirements met

## Post-Phase-11 Enhancements

### Auto-Seed Predefined Branches

- **File created**: `backend/src/config/seedBranches.js`
- **File modified**: `backend/src/config/db.js`
- **Behavior**: On first-ever startup (empty branches collection), the 14 predefined Amharic branches are automatically inserted using a MongoDB session. On subsequent startups, seeding is skipped (idempotent by `countDocuments` check).
- **Branches seeded**:
  - ብስራተ ገብርኤል (BGT), ቡልቡላ (BLB), መስቀል ፍላወር (MSF), ጎላጎል (GLG), ጀሞ ሚካኤል (JMK), ሳር ቤት (SRB), ቤተል (BTL), 4 ኪሎ (4KL), ሰሚት (SMT), ኤርፖርት (APT), ሲኤምሲ (CMC), ቱሉ ዲምቱ (TLD), ወዳጅነት ፓርክ (WDP), መድኃኔዓለም (MDN)
- **Frontend impact**: Branch select fields now show all 14 branches on every fresh startup without needing `node mock/index.js --inject`

## Manual Verification Checklist

- [ ] Request transcription for a report with uploaded audio → 200, transcription returned, status → `transcribed`
- [ ] Request transcription without audio uploaded → 400
- [ ] Request transcription for non-`audio_recorded` report → 400
- [ ] Request transcription without auth → 401
- [ ] Request transcription for non-owned report → 404
- [ ] Verify transcription metadata persisted in MongoDB
- [ ] Verify transcription appears in CreateReportPage after completion
- [ ] If `ADDIS_AI_API_KEY` is valid: verify live STT works with a real audio clip
- [ ] If `ADDIS_AI_API_KEY` is invalid: verify 401/403 error is mapped to "service configuration error" safely
- [ ] Verify frontend shows loading spinner during transcription
- [ ] Verify frontend shows raw transcription + confidence + duration on completion
- [ ] Verify frontend shows error state with retry on failure
- [ ] Verify WAV chunking: upload a WAV file > 60 seconds → transcription succeeds with concatenated results from multiple chunks
