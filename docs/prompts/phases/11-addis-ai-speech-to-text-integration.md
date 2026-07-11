# Phase 11 - Addis AI Speech-To-Text Integration

## Phase Goal

Integrate Addis AI STT through the backend proxy, transcribe uploaded report audio, persist transcription metadata, and expose the transcription result to the frontend for review.

## Mandatory Phase Protocol

### Step 1: Pre-Git Requirement

Run `git status`, `git branch -vv`, and `git fetch origin`. Handle missing remote, uncommitted changes, behind branches, and conflicts exactly as required. Create `phase-11-addis-ai-speech-to-text-integration`. Verify state before implementation.

### Step 2: Comprehensive And Extremely Deep Codebase Analysis

Read Addis AI research docs, backend env/config/constants, audio upload implementation, report model, frontend create report flow, docs, and previous phase summaries.

### Step 3: Comprehensive And Extremely Deep Analysis Of Previously Implemented All Phases

Analyze Phases 1-10. Ensure STT integration uses existing audio metadata, auth, sessions, error handling, and response patterns.

### Step 4: Phase Execution Without Deviation

Implement backend Addis AI STT provider.

Add or update:

```text
backend/src/services/ai/addisAi.client.js
backend/src/services/ai/addisAiStt.service.js
backend/src/services/ai/aiProviderErrors.js
backend/src/controllers/transcription.controller.js
backend/src/routes/transcription.routes.js
backend/src/validators/transcription.validators.js
```

Environment:

- `ADDIS_AI_BASE_URL=https://api.addisassistant.com`
- `ADDIS_AI_API_KEY=sk_replace_me`
- `ADDIS_AI_STT_LANGUAGE_CODE=am`
- `ADDIS_AI_TIMEOUT_MS=60000`

STT endpoint details:

- Provider endpoint: `POST https://api.addisassistant.com/api/v2/stt`
- Request type: `multipart/form-data`
- Headers: `x-api-key` or `X-API-Key`.
- Fields:
  - `audio`: file
  - `request_data`: stringified JSON with `language_code`, default `am`.
- Do not manually set `Content-Type` boundary when using native `FormData`.

Use Node native APIs where possible:

- `fetch`
- `FormData`
- `Blob`

If the Node runtime cannot reliably forward multipart data from uploaded file buffers or disk files, document the issue and add a minimal multipart helper package only if required.

Route:

- `POST /api/v1/reports/:reportId/transcriptions`

Behavior:

- Protected route.
- User must own report.
- Report must have uploaded audio.
- Use latest valid audio clip unless request specifies clip ID.
- Forward audio to Addis AI.
- Persist:
  - raw transcription
  - provider name `addis-ai`
  - provider request ID
  - confidence
  - billed duration
  - language code
  - status
  - error summary if failed
- Update report status to `transcribed`.
- Return transcription payload to frontend.

Error handling:

- Map Addis AI `400`, `401`, `403`, `404`, `429`, `500`, and `503`.
- User messages must be safe:
  - 401/403: service configuration error.
  - 429: service busy/quota, try again later.
  - 500/503: AI service temporarily unavailable.
- Log provider status, request ID if available, and error code.
- Do not log raw transcription in production.

Frontend:

Add/update:

```text
client/src/services/transcriptionApi.js
client/src/components/reports/TranscriptionPanel.jsx
client/src/pages/reports/CreateReportPage.jsx
```

UI behavior:

- After audio upload, user can request transcription.
- Show loading state.
- Show raw transcription when returned.
- Show confidence and billed duration if available.
- Provide clear next step: review/edit transcription in Phase 12.

Do not implement AI report generation in this phase.
Do not use multimodal audio chat for the core flow.

## Critical Accuracy Requirements

Transcription accuracy is the single most important quality metric of the entire product. The following rules are MANDATORY and must be verified before this phase is considered complete:

1. **Correct MIME type per chunk**: After ffmpeg WAV conversion + PCM split, each chunk buffer has a RIFF/WAVE header. The Blob `type` MUST be set to `audio/wav` — not the original `audio/webm`. Detecting WAV by checking the first 4 bytes (`RIFF`) is the approved approach.

2. **Approved chunking pipeline**: The only approved pipeline is: full-file ffmpeg WAV conversion → in-memory PCM-level WAV split. Any other approach (per-segment re-encoding, raw format passthrough) is forbidden unless proven to produce equivalent accuracy.

3. **Re-transcription MUST be available**: The backend must allow transcription when status is `audio_recorded` OR `transcribed`. The frontend must show a Re-transcribe button after completion.

4. **Accuracy regression is a blocking defect**: Any change that degrades transcription quality must be reverted immediately. Accuracy must be verified with real Amharic audio before merging.

Update docs:

- `docs/research/addis-ai.md` with final implemented STT details.
- `docs/phases/phase-11-summary.md`
- Update architecture AI provider section.

Manual verification:

- If `ADDIS_AI_API_KEY` is available, transcribe a valid audio clip.
- If no key is available, verify configuration error handling and document that live STT was not run.
- Do not add automated tests.

### Step 5: User Review And Feedback Integration

Present STT endpoint, provider behavior, frontend state, live/manual verification result, and whether API key was available. Ask for explicit approval before Step 6.

### Step 6: Post-Git Requirement

After explicit approval only, complete Git status/fetch/diff/stage/commit/push/merge/delete/verify using commit message `feat: phase 11 addis ai speech to text integration`.

## Phase Completion Criteria

- Backend STT provider exists.
- Transcription route works or fails safely without key.
- Transcription metadata persists.
- Frontend can trigger and display transcription.
