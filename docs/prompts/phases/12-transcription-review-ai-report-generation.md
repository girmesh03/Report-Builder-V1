# Phase 12 - Transcription Review And AI Report Generation

## Phase Goal

Allow the user to review/edit transcription and then generate a structured daily supervisor report using Addis AI text generation.

## Mandatory Phase Protocol

### Step 1: Pre-Git Requirement

Run `git status`, `git branch -vv`, and `git fetch origin`. Handle missing remote, uncommitted changes, behind branches, and conflicts exactly as required. Create `phase-12-transcription-review-ai-report-generation`. Verify state before implementation.

### Step 2: Comprehensive And Extremely Deep Codebase Analysis

Read transcription implementation, report model, Addis AI text generation docs, frontend create report flow, constants, docs, and previous phase summaries.

### Step 3: Comprehensive And Extremely Deep Analysis Of Previously Implemented All Phases

Analyze Phases 1-11. Ensure report generation uses reviewed transcription, not raw unreviewed STT output.

### Step 4: Phase Execution Without Deviation

Before finalizing the AI report schema, ask the user whether there is an exact company report template. If the user provides one, use it. If not, use the default daily supervisor report structure from the initial requirements.

Backend implementation:

Add/update:

```text
backend/src/models/aiGeneration.model.js
backend/src/services/ai/addisAiText.service.js
backend/src/services/reportPrompt.service.js
backend/src/controllers/reportGeneration.controller.js
backend/src/routes/reportGeneration.routes.js
backend/src/validators/reportGeneration.validators.js
backend/src/utils/promptVersions.js
```

Routes:

- `PATCH /api/v1/reports/:reportId/transcriptions/review`
- `POST /api/v1/reports/:reportId/generate`

Reviewed transcription:

- User can save edited transcription.
- Persist reviewed transcription separately from raw transcription.
- Track reviewedAt.
- Track reviewer user ID.
- Update report status to `transcription_reviewed`.

Addis AI text generation details:

- Provider endpoint: `POST https://api.addisassistant.com/api/v1/chat_generate`
- Request type: JSON.
- Headers:
  - `Content-Type: application/json`
  - `X-API-Key: <secret>`
- Body:

```json
{
  "model": "Addis-፩-አሌፍ",
  "prompt": "STRICT_REPORT_PROMPT",
  "target_language": "am",
  "generation_config": {
    "temperature": 0.2,
    "maxOutputTokens": 4096,
    "topP": 0.9,
    "topK": 40
  }
}
```

Prompt requirements:

- State the model is generating a daily branch supervision report.
- Use only facts from the reviewed transcription and report metadata.
- Do not fabricate branch names, dates, times, people, actions, or outcomes.
- If something is missing, write `Not specified`.
- Preserve Amharic content naturally if the transcription is Amharic.
- Produce a structured report matching the selected template.
- Include branch names, report date, supervisor, activities, observations, issues, actions, pending tasks, recommendations, and conclusion.
- Ask for concise professional wording.

Response handling:

- Persist AI output.
- Persist model version.
- Persist token usage.
- Persist prompt version.
- Persist finish reason.
- Persist provider status/error.
- Update report status to `generated`.

Controller rules:

- All controllers use `asyncHandler`.
- Writes use `try`, `catch`, and `finally`.
- Writes support sessions.
- Errors go to global handler with `next(error)`.

Frontend implementation:

Add/update:

```text
client/src/components/reports/TranscriptionReviewEditor.jsx
client/src/components/reports/GenerateReportPanel.jsx
client/src/services/reportGenerationApi.js
client/src/pages/reports/CreateReportPage.jsx
```

UI behavior:

- Show transcription editor.
- User can save reviewed transcription.
- User can generate report only after reviewed transcription exists.
- Show loading state while generating.
- Show provider error safely.
- Display generated report preview placeholder or basic preview; full preview/edit is Phase 13.

Form rules:

- Use `...register`.
- Do not use `watch`.
- Do not use `Controller` unless impossible.

Update docs:

- `docs/phases/phase-12-summary.md`
- `docs/ARCHITECTURE.md` AI generation section.
- `docs/research/addis-ai.md` with text-generation implementation notes.

Manual verification:

- Save reviewed transcription.
- Generate report with valid key if available.
- Verify safe failure without key.
- Confirm generation uses reviewed text.

### Step 5: User Review And Feedback Integration

Present reviewed transcription flow, prompt design, generated output behavior, live/manual verification, and template assumption. Ask for explicit approval before Step 6.

### Step 6: Post-Git Requirement

After explicit approval only, complete Git status/fetch/diff/stage/commit/push/merge/delete/verify using commit message `feat: phase 12 transcription review and ai report generation`.

## Phase Completion Criteria

- Reviewed transcription is saved.
- Addis AI text generation is integrated.
- Generated report persists.
- Frontend can trigger generation.
