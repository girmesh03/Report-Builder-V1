# Addis AI Research Summary

## Provider

Addis AI provides African-language AI infrastructure. Focus areas: voice, chat, translation, and localization for Amharic, Afan Oromo, and English.

## Base URLs

- **API:** https://api.addisassistant.com
- **Dashboard/Playground:** https://platform.addisassistant.com
- **Realtime WebSocket relay:** wss://relay.addisassistant.com/ws?apiKey=<API_KEY>

## Authentication

- API keys start with `sk_`.
- REST authentication: header `x-api-key` or `X-API-Key`.
- **Backend-only rule:** keys stored only in backend environment variables, never in frontend code.

## Endpoints

| Service           | Method | Endpoint                     | Request Type        |
|-------------------|--------|------------------------------|---------------------|
| Speech-to-Text    | POST   | /api/v2/stt                  | multipart/form-data |
| Text Generation   | POST   | /api/v1/chat_generate        | application/json    |
| Text-to-Speech    | POST   | /api/v1/audio                | application/json    |
| Translation       | POST   | /api/v1/translate            | application/json    |
| Multimodal Chat   | POST   | /api/v1/chat_generate        | multipart/form-data |

## Main Text Model

`Addis-፩-አሌፍ`

## Speech-to-Text (STT) Details

- Supported formats: WAV, MP3, M4A, WebM.
- Recommended: WAV, 16 kHz+, mono, quiet environment.
- Max duration: 60 seconds.
- Max file size: 10 MB.
- Optimized for single-speaker audio.

## Text Generation Details

- Request fields: model, prompt, target_language, conversation_history, generation_config (temperature, maxOutputTokens, topP, topK).
- Response includes: response_text, finish_reason, usage_metadata, modelVersion.
- Report generation temperature: 0.2 (low).

## Text-to-Speech (TTS)

- Request fields: text, language, voice_id (optional), stream (optional).
- Response: Base64 WAV audio.
- Not required for initial workflow.

## Translation

- Supports: Amharic (am), Afan Oromo (om), English (en).
- Response nests translated text under `data.translation`.
- Optional for later; not applied by default.

## Error Handling

Error shape: `{ status: "error", error: { code, message, param? } }`

| Code | Meaning                       |
|------|-------------------------------|
| 400  | Invalid request/missing field |
| 401  | Missing or invalid API key    |
| 403  | Key lacks permission          |
| 404  | Endpoint/model not found      |
| 429  | Rate limit or quota exceeded  |
| 500  | Server error                  |
| 503  | Service overloaded            |

## Project Implementation Decisions

- Backend proxy only — no direct client calls to Addis AI.
- Native Node fetch, FormData, Blob for HTTP calls.
- Multer for receiving browser audio uploads.
- Backend chunks long WAV audio (exceeding 60s) into smaller segments before STT. Frontend always sends a single upload per ADR-005.
- Transcription review step is mandatory before report generation.

## Phase 11: STT Integration Details

- STT client: `backend/src/services/ai/addisAi.client.js` — base HTTP client with native `fetch`, `AbortController` timeout, `x-api-key` auth header, error mapping
- STT service: `backend/src/services/ai/addisAiStt.service.js` — reads audio from disk via `fs.promises.readFile`, creates `FormData` with audio `Blob` and `request_data` JSON, posts to `/api/v2/stt`
- Error mapping: `backend/src/services/ai/aiProviderErrors.js` — maps 401/403 to "configuration error", 429 to "busy/try again", 500/503 to "temporarily unavailable"
- Route: `POST /api/v1/reports/:reportId/transcriptions` — authenticated, ownership-scoped
- Frontend: `TranscriptionPanel.jsx` — request button, loading spinner, raw text display, confidence/duration metadata
- Report status advances: `audio_recorded` → `transcribed`. Re-transcription allowed from `transcribed` for accuracy testing.
- **Accuracy-critical implementation:** Chunks are WAV (pcm_s16le, 16kHz, mono) after ffmpeg conversion + PCM split. Blob `type` MUST be `audio/wav` — detected by `RIFF` header. Wrong MIME type = garbled transcription. See RULES.md rules 13.21-13.25.
- No additional packages needed — all native Node APIs

See [addis-ai-concrete-understanding.md](./addis-ai-concrete-understanding.md) for the full research document.
