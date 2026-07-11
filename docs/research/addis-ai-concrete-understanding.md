# Addis AI Concrete Understanding

Research date: 2026-07-05

Primary sources:

- https://www.addisai.ch/
- https://docs.addisassistant.com/docs/get-started/introduction
- https://docs.addisassistant.com/docs/get-started/quickstart
- https://docs.addisassistant.com/docs/capabilities/text-generation
- https://docs.addisassistant.com/docs/capabilities/text-to-speech
- https://docs.addisassistant.com/docs/capabilities/speech-to-text
- https://docs.addisassistant.com/docs/capabilities/multimodal
- https://docs.addisassistant.com/docs/capabilities/realtime
- https://docs.addisassistant.com/docs/capabilities/translation
- https://docs.addisassistant.com/docs/integration/web
- https://docs.addisassistant.com/docs/integration/server
- https://docs.addisassistant.com/docs/integration/voice-interface
- https://docs.addisassistant.com/docs/platform/errors

## Provider Identity

Addis AI provides African-language AI infrastructure for voice, chat, retrieval, translation, and localization. The public website presents Addis AI as supporting voice AI, cross-lingual RAG, chat, speech-to-text, text-to-speech, translation, and enterprise deployments.

## Base URLs And Platform

- Developer/API base URL: `https://api.addisassistant.com`
- Playground/dashboard: `https://platform.addisassistant.com`
- Realtime relay: `wss://relay.addisassistant.com/ws?apiKey=<API_KEY>`

## Authentication

- API keys are generated in the Addis AI dashboard.
- Secret keys start with `sk_`.
- REST authentication uses `x-api-key` or `X-API-Key`.
- The key must never be exposed in frontend code.
- The app must call Addis AI only from the backend.

## Core Model Families

- Text model: `Addis-፩-አሌፍ`
- STT model family: `addis-whisper`
- Voice models: `አሌፍ-Audio-AM`, `አሌፍ-Audio-OM`
- Realtime audio model: `አሌፍ-1.2-realtime-audio`

## Language Support Relevant To This Project

- Public website FAQ says current support includes English, Amharic, Afan Oromo, and Tigrinya.
- Text generation docs emphasize Amharic and Afan Oromo, with English instructions understood.
- STT docs specifically say Amharic and Afan Oromo.
- Translation supports bidirectional translation between Amharic `am`, Afan Oromo `om`, and English `en`.
- For this app, implement Amharic `am` and English-aware prompting as first-class. Keep language constants extensible for Oromo `om` and Tigrinya where appropriate.

## Text Generation

Endpoint:

`POST https://api.addisassistant.com/api/v1/chat_generate`

Request body is JSON for standard text generation:

```json
{
  "model": "Addis-፩-አሌፍ",
  "prompt": "string",
  "target_language": "am",
  "conversation_history": [
    { "role": "user", "content": "string" },
    { "role": "assistant", "content": "string" }
  ],
  "generation_config": {
    "temperature": 0.2,
    "maxOutputTokens": 2048,
    "topP": 0.9,
    "topK": 40
  }
}
```

Response shape:

```json
{
  "response_text": "The generated text response...",
  "finish_reason": "stop",
  "usage_metadata": {
    "prompt_token_count": 12,
    "candidates_token_count": 45,
    "total_token_count": 57
  },
  "modelVersion": "Addis-፩-አሌፍ"
}
```

Project use:

- Use this endpoint after the user reviews transcription.
- Use a strict report-generation prompt and ask for structured JSON-like output.
- Use low temperature, ideally `0.2`, for factual report generation.
- Keep AI keys only in backend `.env`.

## Speech To Text

Endpoint:

`POST https://api.addisassistant.com/api/v2/stt`

Request is `multipart/form-data`:

- `audio`: uploaded audio file.
- `request_data`: stringified JSON, for example `{ "language_code": "am" }`.

Response shape:

```json
{
  "status": "success",
  "data": {
    "transcription": "ሰላም እንኳን ደህና መጣችሁ",
    "usage_metadata": {
      "totalBilledDuration": "15s",
      "requestId": "69b60667-0000-2a1e-b6d3-d4f547fe6724"
    }
  },
  "confidence": 0.982
}
```

Supported audio formats:

- WAV: `audio/wav`, `audio/x-wav`, `audio/wave`
- MP3: `audio/mpeg`, `audio/mp3`
- M4A: `audio/mp4`, `audio/x-m4a`
- WebM: `audio/webm`

Documented constraints:

- Max duration: 60 seconds.
- Max file size: 10 MB.
- Recommended sample rate: 16 kHz or higher.
- Mono preferred.
- Quiet environment and 10-30cm microphone distance recommended.
- Optimized for single-speaker audio.
- Overlapping voices and heavy code-switching may reduce accuracy.

Project use:

- Frontend imposes no duration limit (ADR-005). Backend chunks long WAV recordings before STT. **Accuracy-critical:** The chunking pipeline converts full audio to WAV via ffmpeg (single pass, pcm_s16le, 16kHz, mono) before PCM-level split. Per-segment re-encoding causes Opus decoder priming artifacts that degrade transcription quality.
- Per ADR-005, frontend sends a single upload; backend transparently chunks long audio at STT time.
- The app should preserve the review step after transcription.
- Do not skip the transcription review by sending raw audio directly to report generation.

## Text To Speech

Endpoint:

`POST https://api.addisassistant.com/api/v1/audio`

Request body is JSON:

```json
{
  "text": "string",
  "language": "am",
  "voice_id": "male_1",
  "stream": false
}
```

Response includes Base64 WAV audio, commonly under `audio`.

Project use:

- TTS is not required for the first report-builder workflow.
- Keep service support possible for later voice playback or AI chat.

## Multimodal

Endpoint:

`POST https://api.addisassistant.com/api/v1/chat_generate`

Request is `multipart/form-data` when attaching files:

- `image` or `audio`
- `request_data`: stringified JSON with `prompt`, `target_language`, and generation config.

Important distinction:

- STT transcribes words.
- Multimodal audio chat reasons over audio and can summarize or extract action items.

Project decision:

- Use STT first because this project requires the user to review transcription before AI report generation.
- Keep multimodal audio analysis as a future enhancement, not the primary V1 path.

## Translation

Endpoint:

`POST https://api.addisassistant.com/api/v1/translate`

Request body:

```json
{
  "text": "string",
  "source_language": "am",
  "target_language": "en"
}
```

Response nests translation under `data.translation`.

Project use:

- Optional. Do not translate by default because the report may be intentionally Amharic, English, or mixed.
- Consider a later UI control if the user wants final reports in a chosen target language.

## Realtime

Endpoint:

`wss://relay.addisassistant.com/ws?apiKey=<API_KEY>`

Protocol:

- Client waits for `{ "setupComplete": true }` or status ready event.
- Client sends base64 PCM16 audio chunks in JSON envelopes:

```json
{
  "data": "BASE64_ENCODED_PCM16_CHUNK",
  "mimeType": "audio/pcm;rate=16000"
}
```

- Server returns base64 PCM16 audio under `serverContent.modelTurn.parts[0].inlineData.data`.

Project use:

- Do not expose secret keys in browser WebSocket URLs.
- Realtime is not required for the V1 report creation workflow.
- If later implemented, use a backend-controlled strategy and verify whether Addis AI supports short-lived client tokens.

## Errors

Error object:

```json
{
  "status": "error",
  "error": {
    "code": "invalid_api_key",
    "message": "Invalid or expired API key.",
    "param": "optional"
  }
}
```

Status codes:

- `400`: invalid request or missing field.
- `401`: missing or invalid API key.
- `403`: key lacks permission.
- `404`: endpoint/model missing.
- `429`: rate limit or quota.
- `500`: Addis AI server error.
- `503`: service overloaded.

Project handling:

- Map Addis AI errors to safe user messages.
- Log provider request IDs and status codes, not raw sensitive report content.
- Implement timeout and retry/backoff for `429`, `500`, and `503` where safe.

## Package And Implementation Implications

- Use backend proxy only.
- Use native `fetch` in Node where possible.
- Use `multer` for receiving browser audio uploads.
- Use Node `FormData`/`Blob` if available; if project Node version does not support reliable multipart forwarding, add a small documented multipart helper package.
- Do not install an Addis AI SDK unless official docs publish one. Docs currently say JavaScript/TypeScript SDKs are coming soon.
- Use environment variables:
  - `ADDIS_AI_BASE_URL=https://api.addisassistant.com`
  - `ADDIS_AI_API_KEY=sk_...`
  - `ADDIS_AI_TEXT_MODEL=Addis-፩-አሌፍ`
  - `ADDIS_AI_DEFAULT_TARGET_LANGUAGE=am`
  - `ADDIS_AI_STT_LANGUAGE_CODE=am`
  - `ADDIS_AI_TIMEOUT_MS=60000`
  - `FFMPEG_PATH=/c/ffmpeg/ffmpeg` (or system ffmpeg path)
  - `FFPROBE_PATH=/c/ffmpeg/ffprobe` (or system ffprobe path)

