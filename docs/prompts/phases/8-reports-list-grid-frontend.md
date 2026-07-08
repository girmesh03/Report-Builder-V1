# Phase 8 - Reports List And Grid Frontend

## Phase Goal

Build the Reports page with list view using cards, grid view using MUI Data Grid, filtering, search, pagination integration, and create/edit report metadata dialogs.

## Mandatory Phase Protocol

### Step 1: Pre-Git Requirement

Run `git status`, `git branch -vv`, and `git fetch origin`. Handle missing remote, uncommitted changes, behind branches, and conflicts exactly as required. Create `phase-8-reports-list-grid-frontend`. Verify state before implementation.

### Step 2: Comprehensive And Extremely Deep Codebase Analysis

Read reports backend endpoints, frontend shell, reusable components, store patterns, theme, docs, and previous phase summaries.

### Step 3: Comprehensive And Extremely Deep Analysis Of Previously Implemented All Phases

Analyze Phases 1-7. Ensure frontend uses current backend API shapes and existing reusable components.

### Step 4: Phase Execution Without Deviation

Implement reports UI.

Required files:

```text
client/src/pages/reports/ReportsPage.jsx
client/src/pages/reports/CreateReportPage.jsx
client/src/components/reports/ReportsToolbar.jsx
client/src/components/reports/ReportCard.jsx
client/src/components/reports/ReportsCardList.jsx
client/src/components/reports/ReportsDataGrid.jsx
client/src/components/reports/ReportStatusChip.jsx
client/src/components/reports/ReportMetadataDialog.jsx
client/src/services/reportsApi.js
client/src/services/branchesApi.js
client/src/store/reportsSlice.js
client/src/store/branchesSlice.js
```

Reports page:

- Replace placeholder with real Reports page.
- Provide segmented toggle for List and Grid.
- List view uses cards.
- Grid view uses `MuiDataGrid`/MUI Data Grid.
- Search by title/branch.
- Filter by status.
- Filter by date range if reasonable.
- Server pagination.
- Empty/loading/error states.
- Create report action.

Create report metadata:

- User selects date.
- User selects one or more branches.
- User enters optional title/notes.
- This phase does not implement audio recording yet.
- On submit, create a draft report and navigate to create report page or detail scaffold.

MUI/DataGrid rules:

- Tree-shaking imports.
- No deprecated MUI props.
- Use `slotProps`.
- Use MUI Grid `size`, never `item`.
- Ensure mobile layout works.

Forms:

- Use React Hook Form `...register`.
- Do not use `watch`.
- Do not use `Controller` unless impossible.
- If MUI DatePicker makes `Controller` unavoidable, document why and keep it narrowly scoped. Prefer registered native date input if acceptable.

Docs:

- `docs/phases/phase-8-summary.md`
- Update architecture/frontend workflow docs.

Manual verification:

- List reports.
- Switch list/grid.
- Create draft report.
- Validate responsive behavior.

### Step 5: User Review And Feedback Integration

Present UI behavior, routes, API integration, manual verification, and screenshots/visual notes if available. Ask for explicit approval before Step 6.

### Step 6: Post-Git Requirement

After explicit approval only, complete Git status/fetch/diff/stage/commit/push/merge/delete/verify using commit message `feat: phase 8 reports list and grid frontend`.

## Phase Completion Criteria

- Reports page has list and grid views.
- Draft report metadata creation works.
- Branch selection works.
- UI is responsive.
