# Phase 15 - AI Chat, Translation-Ready Services, And Voice Service Preparation

## Phase Goal

Add a protected AI assistant/chat surface for report-related questions and prepare service modules for Addis AI translation, TTS, multimodal, and realtime future use without overbuilding non-required flows.

## Mandatory Phase Protocol

### Step 1: Pre-Git Requirement

Run `git status`, `git branch -vv`, and `git fetch origin`. Handle missing remote, uncommitted changes, behind branches, and conflicts exactly as required. Create `phase-15-ai-chat-translation-voice-service-preparation`. Verify state before implementation.

### Step 2: Comprehensive And Extremely Deep Codebase Analysis

Read Addis AI research docs, AI generation service, report pages, protected shell, docs, and previous phase summaries.

### Step 3: Comprehensive And Extremely Deep Analysis Of Previously Implemented All Phases

Analyze Phases 1-14. Ensure this phase reuses the existing Addis AI client and does not duplicate provider logic.

### Step 4: Phase Execution Without Deviation

Implement a modest protected AI chat feature and provider service preparation.

Backend:

Add/update:

```text
backend/src/controllers/aiChat.controller.js
backend/src/routes/aiChat.routes.js
backend/src/services/ai/addisAiChat.service.js
backend/src/services/ai/addisAiTranslation.service.js
backend/src/services/ai/addisAiTts.service.js
backend/src/services/ai/addisAiMultimodal.service.js
backend/src/validators/aiChat.validators.js
```

Chat endpoint:

- `POST /api/v1/ai/chat`

Behavior:

- Protected route.
- Accept message, optional reportId, targetLanguage.
- If reportId is provided, user must own report.
- Include limited report context only when user requests report-related help.
- Do not send raw audio.
- Do not send unnecessary sensitive content.
- Use Addis AI text generation endpoint `/api/v1/chat_generate`.
- Use `conversation_history` if the frontend sends a bounded history.
- Cap message/history lengths with constants.
- Return `response_text`, model, usage metadata, and finish reason.

Translation service:

- Add service wrapper for `POST /api/v1/translate`.
- Do not add UI translation flow unless small and safe.
- Keep ready for future report language conversion.

TTS service:

- Add service wrapper for `POST /api/v1/audio`.
- Do not add autoplay or voice playback unless explicitly simple.

Multimodal service:

- Add documented wrapper shape for `multipart/form-data` `/api/v1/chat_generate`.
- Do not use it for core report generation.

Realtime:

- Document that `wss://relay.addisassistant.com/ws?apiKey=<API_KEY>` exists but must not be used directly from browser with a secret key.
- Do not implement browser realtime with the secret key.
- If adding a future route placeholder, make it clearly disabled until a secure token strategy is confirmed.

Frontend:

Add/update:

```text
client/src/pages/ai/AiChatPage.jsx
client/src/components/ai/AiChatPanel.jsx
client/src/components/ai/AiMessageList.jsx
client/src/components/ai/AiMessageComposer.jsx
client/src/services/aiChatApi.js
client/src/store/aiChatSlice.js
```

UI:

- Protected route `/ai-chat`.
- Add sidebar item `AI Chat`.
- English UI labels.
- User can type English or Amharic.
- Assistant response can be English or Amharic.
- Optional report selector if reports are available.
- Use multiline `MuiTextField`.
- Avoid typing lag by keeping composer local and avoiding global updates per keystroke.
- Do not use `useDebounce`.
- Use `...register`.
- Do not use `watch`.
- No tests.

Update docs:

- `docs/phases/phase-15-summary.md`
- `docs/research/addis-ai.md` with chat/translation/TTS/realtime preparation notes.
- `docs/ARCHITECTURE.md` AI service layer section.

Manual verification:

- Send chat message with API key if available.
- Verify safe configuration error without key.
- Verify no key appears in frontend bundle/logs.

### Step 5: User Review And Feedback Integration

Present AI chat behavior, service wrappers, security decisions, realtime limitation, and manual verification. Ask for explicit approval before Step 6.

### Step 6: Post-Git Requirement

After explicit approval only, complete Git status/fetch/diff/stage/commit/push/merge/delete/verify using commit message `feat: phase 15 ai chat and voice service preparation`.

## Phase Completion Criteria

- Protected AI chat works or fails safely without API key.
- Addis AI service wrappers are organized.
- Translation/TTS/multimodal/realtime are documented for future use.
- No secret key is exposed to frontend.
