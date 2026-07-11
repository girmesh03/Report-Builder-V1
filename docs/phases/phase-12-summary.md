# Phase 12 — Transcription Review And AI Report Generation

## Summary

Phase 12 adds the ability for users to review and edit the raw transcription, then generate a structured daily report using Addis AI text generation. This completes the core product workflow: audio recording → transcription → **review** → **AI generation** → export.

## Files Created

### Backend (6 files)

| File | Purpose |
|---|---|
| `backend/src/validators/reportGeneration.validators.js` | Validates `reviewedTranscription` is non-empty |
| `backend/src/utils/promptVersions.js` | Version constant (`v1.1.0`) for AI prompt tracking |
| `backend/src/services/reportPrompt.service.js` | Builds structured Amharic prompt with 18+ strict rules for AI report generation |
| `backend/src/services/ai/addisAiText.service.js` | Calls Addis AI `POST /api/v1/chat_generate` with model `Addis-፩-አሌፍ`, temperature 0.2 |
| `backend/src/controllers/reportGeneration.controller.js` | Two handlers: `saveReviewedTranscription` and `generateReport`, both with session support |
| `backend/src/routes/reportGeneration.routes.js` | Routes: `PATCH /transcriptions/review` and `POST /generate` |

### Frontend (3 files)

| File | Purpose |
|---|---|
| `client/src/services/reportGenerationApi.js` | `saveReviewedTranscription()` and `generateReport()` API calls |
| `client/src/components/reports/TranscriptionReviewEditor.jsx` | Text area pre-filled with raw transcription, save button, saved confirmation state |
| `client/src/components/reports/GenerateReportPanel.jsx` | Generate button with loading spinner, provider error display, basic report text preview |

### Modified Files

| File | Change |
|---|---|
| `backend/src/models/report.model.js` | Added `reviewedAt` (Date) and `reviewerUserId` (ObjectId ref) fields |
| `backend/src/routes/index.js` | Mounted `reportGenerationRoutes` at `/reports/:reportId` |
| `client/src/pages/reports/CreateReportPage.jsx` | Added transcription review editor and generate report panel to the workflow |

## Routes Added

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| PATCH | `/api/v1/reports/:reportId/transcriptions/review` | Authenticated | Save user-edited transcription, advance to `transcription_reviewed` |
| POST | `/api/v1/reports/:reportId/generate` | Authenticated | Generate AI report from reviewed transcription, advance to `generated` |

## Key Design Decisions

- **Session pattern for generation**: The session is committed before the long-running AI call (30-60s+) to avoid holding a transaction open. This is documented in the controller JSDoc.
- **Reviewed transcription persisted separately**: The reviewed transcription is a separate string field from the raw transcription, enabling the user to see both if needed.
- **ReviewedAt and reviewerUserId**: Tracks who reviewed and when, for audit trail.
- **Prompt version tracking**: `promptVersions.js` stores the version of the prompt used for each generation, enabling future prompt upgrades.
- **First-person supervisor perspective**: The prompt instructs the AI to write from the supervisor's point of view using "አረጋግጫለሁ" (I verified), "አሳውቄአለሁ" (I informed).
- **Word selection tables**: The prompt includes 3 tables for Amharic word selection — English words to convert to pure Amharic, workplace loanwords to keep, and spelling corrections.
- **Self-check mechanism**: The prompt includes a 4-step self-verification (fact check, word choice, format, quality) that the AI must run before outputting.

## Prompt Rules Enforced

The prompt enforces all 18 rules from RULES.md section 15 and PROBLEM_STATEMENT.md:

1. Report in Amharic
2. Exact section structure
3. Professional, direct, clear tone
4. Reviewed transcription is source of truth
5. No fabricated information
6. Missing info → "Not specified" (አልተገለጸም)
7. Separate completed activities from unresolved issues
8. Urgent problems under "መፍትሄ የሚፈሉ ጉዳዮች"
9. General opinion under "አጠቃላይ አስተያየት"
10. Preserve branch-specific details
11. Preserve time ranges per branch
12. Supervisor's first-person perspective
13. No explanation of how report was generated
14. No unrelated conversation content
15. Do not include Person 2's questions
16. English/technical words in Amharic workplace transliteration
17. Concise professional wording
18. Transcription is raw material, not final report

Plus detailed self-check instructions, time/date extraction guides, and conversational filler removal rules.

## User Flow

1. Record audio → upload → status: `audio_recorded`
2. Request transcription → status: `transcribed`
3. Review and edit transcription in textarea → Save → status: `transcription_reviewed`
4. Click "Generate Report" → AI builds report → status: `generated` → preview shown
5. Full preview/edit → Phase 13

## Post-Build Verification

- Backend: All source files pass `node --check`
- Client: All files pass `vite build` (0 errors)
