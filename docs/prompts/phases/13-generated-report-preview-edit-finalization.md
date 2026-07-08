# Phase 13 - Generated Report Preview, Edit, And Finalization

## Phase Goal

Build a polished report preview and editing workflow so the user can review generated content, make final edits, and mark the report finalized before export.

## Mandatory Phase Protocol

### Step 1: Pre-Git Requirement

Run `git status`, `git branch -vv`, and `git fetch origin`. Handle missing remote, uncommitted changes, behind branches, and conflicts exactly as required. Create `phase-13-generated-report-preview-edit-finalization`. Verify state before implementation.

### Step 2: Comprehensive And Extremely Deep Codebase Analysis

Read report generation output shape, report model, frontend create/report pages, docs, and previous phase summaries.

### Step 3: Comprehensive And Extremely Deep Analysis Of Previously Implemented All Phases

Analyze Phases 1-12. Ensure preview/finalization respects generated report persistence and report statuses.

### Step 4: Phase Execution Without Deviation

Backend:

Add/update endpoints:

- `GET /api/v1/reports/:reportId/preview`
- `PATCH /api/v1/reports/:reportId/generated-report`
- `POST /api/v1/reports/:reportId/finalize`

Behavior:

- User must own report.
- Preview returns report metadata, branches, reviewed transcription summary, generated report, edited report, and status.
- Editing generated report stores `editedReport` separately and tracks editedAt.
- Finalize sets status `finalized`.
- Finalize requires generated or edited report content.
- All writes use sessions, `try/catch/finally`, and global error handling.

Frontend:

Add/update:

```text
client/src/pages/reports/ReportPreviewPage.jsx
client/src/components/reports/ReportPreview.jsx
client/src/components/reports/ReportSection.jsx
client/src/components/reports/ReportEditor.jsx
client/src/components/reports/ReportFinalizeBar.jsx
client/src/services/reportPreviewApi.js
```

UI:

- Dedicated preview route: `/reports/:reportId/preview`.
- Show report title, date, branch names, status, and generated content.
- Toggle between preview and edit mode.
- Save edits.
- Finalize report.
- Show clear status progress.
- Handle Amharic text gracefully with fonts and spacing.
- Preserve line breaks.
- Avoid text overflow on mobile.
- Use MUI and reusable components.
- No Tailwind.
- No tests.

Editing:

- Use a multiline `MuiTextField`.
- Use React Hook Form `...register`.
- Do not use `watch`.
- Avoid lag when typing long reports:
  - Keep editor isolated from heavy parent re-renders.
  - Avoid updating global state on every keystroke.
  - Submit content on save.
  - Do not use `useDebounce`.

Navigation:

- Reports grid/list links to preview for generated/finalized reports.
- Create flow navigates to preview after successful generation.

Update docs:

- `docs/phases/phase-13-summary.md`
- Update report lifecycle docs.

Manual verification:

- Open generated report preview.
- Edit and save.
- Finalize.
- Verify status in Reports list/grid.
- Verify mobile layout.

### Step 5: User Review And Feedback Integration

Present preview/edit/finalize behavior, report lifecycle changes, and manual verification. Ask for explicit approval before Step 6.

### Step 6: Post-Git Requirement

After explicit approval only, complete Git status/fetch/diff/stage/commit/push/merge/delete/verify using commit message `feat: phase 13 generated report preview edit and finalization`.

## Phase Completion Criteria

- Report preview page works.
- User can edit generated report.
- User can finalize report.
- Reports list/grid reflects status changes.
