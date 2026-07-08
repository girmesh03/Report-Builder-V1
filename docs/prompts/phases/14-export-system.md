# Phase 14 - Export System

## Phase Goal

Implement report export as PDF, TXT, CSV, and spreadsheet, with export actions available from report preview and reports grid/list context.

## Mandatory Phase Protocol

### Step 1: Pre-Git Requirement

Run `git status`, `git branch -vv`, and `git fetch origin`. Handle missing remote, uncommitted changes, behind branches, and conflicts exactly as required. Create `phase-14-export-system`. Verify state before implementation.

### Step 2: Comprehensive And Extremely Deep Codebase Analysis

Read report preview, reports grid/list, package decisions, MUI Data Grid usage, docs, and previous phase summaries.

### Step 3: Comprehensive And Extremely Deep Analysis Of Previously Implemented All Phases

Analyze Phases 1-13. Ensure exports use finalized or current edited report content correctly.

### Step 4: Phase Execution Without Deviation

Implement export system.

Frontend files:

```text
client/src/components/exports/ExportMenu.jsx
client/src/components/exports/ExportButtonGroup.jsx
client/src/services/exportService.js
client/src/utils/exportFormatters.js
client/src/utils/reportExportRows.js
```

Backend optional files if logging export history:

```text
backend/src/controllers/export.controller.js
backend/src/routes/export.routes.js
backend/src/services/exportLog.service.js
```

PDF:

- Use `jspdf` and `jspdf-autotable`.
- Export report metadata and report sections.
- Handle Amharic as well as possible. If default PDF font cannot render Ethiopic reliably, document limitation and add a font strategy only if available. Do not silently produce broken text.
- Include report title, date, branch names, supervisor, status, and content.

TXT:

- Use Blob download with UTF-8 text.
- Preserve Amharic text and line breaks.

CSV:

- For reports grid, use Data Grid CSV export or custom CSV.
- Include UTF-8 BOM for Excel compatibility.
- Escape formulas to avoid CSV injection.
- Include useful columns:
  - title
  - date
  - branches
  - status
  - createdAt
  - updatedAt

Spreadsheet:

- Use `exceljs` and `file-saver`.
- Do not assume community `@mui/x-data-grid` supports Excel export.
- Create `.xlsx` with report rows or single report details as appropriate.
- Include workbook metadata.
- Preserve UTF-8 text.

UI:

- Export menu on report preview.
- Export actions on reports page.
- Disable export if report has no generated/edited content for single report export.
- Clear loading/error state.

Backend export history:

- If implemented, record:
  - report
  - user
  - format
  - exportedAt
- Do not block frontend export if logging fails unless compliance requires it.

Report status:

- After export, report can be marked/export history appended.
- Do not overwrite finalized content.

MUI rules:

- Tree-shaking imports.
- No deprecated props.
- Use icons for export actions.

Update docs:

- `docs/phases/phase-14-summary.md`
- Update export architecture notes.

Manual verification:

- Export single report as TXT.
- Export single report as PDF.
- Export grid/list as CSV.
- Export spreadsheet.
- Open exported files and check content.

### Step 5: User Review And Feedback Integration

Present export formats, limitations, files generated in manual verification, and any font caveats. Ask for explicit approval before Step 6.

### Step 6: Post-Git Requirement

After explicit approval only, complete Git status/fetch/diff/stage/commit/push/merge/delete/verify using commit message `feat: phase 14 report export system`.

## Phase Completion Criteria

- PDF export exists.
- TXT export exists.
- CSV export exists.
- Spreadsheet export exists without relying on MUI X Premium.
