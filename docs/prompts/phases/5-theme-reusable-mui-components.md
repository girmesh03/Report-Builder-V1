# Phase 5 - Theme Integration And Reusable MUI Components

## Phase Goal

Integrate the user-provided theme files and build the reusable MUI component layer required by the application.

## Mandatory Phase Protocol

### Step 1: Pre-Git Requirement

Run `git status`, `git branch -vv`, and `git fetch origin`. Handle missing remote, uncommitted changes, behind branches, and conflicts exactly as required. Create `phase-5-theme-reusable-mui-components`. Verify state before implementation.

### Step 2: Comprehensive And Extremely Deep Codebase Analysis

Read all client source, current MUI usage, auth pages, docs, package files, and previous phase summaries. Identify direct MUI form/control usage that should be refactored.

### Step 3: Comprehensive And Extremely Deep Analysis Of Previously Implemented All Phases

Analyze Phases 1-4. Confirm reusable components align with existing auth pages and layouts.

### Step 4: Phase Execution Without Deviation

Theme files are already placed at `client/src/theme/` (AppTheme.jsx, themePrimitives.js, customizations/). Inspect them and integrate, do not ask the user to re-provide.

Required reusable component directory:

`client/src/components/reusable/`

Component rules:

- Prefix every reusable MUI component with `Mui`.
- Use tree-shaking MUI imports.
- Wrap input components with `forwardRef`.
- `MuiTextField` must default to `size="small"`.
- `MuiTextField` must support `startAdornment` and `endAdornment`.
- `MuiPasswordField` must provide show/hide password icon behavior with no layout shift.
- `MuiDialog` must pass/support `disableEnforceFocus` and `disableRestoreFocus`.
- Avoid deprecated MUI props. Use slots and `slotProps` where applicable.
- Avoid input lag. Keep text fields controlled only when necessary. Prefer React Hook Form `register` integration.
- Do not use `useDebounce`.
- No Tailwind.
- No hardcoded theme values except safe fallback tokens before provided theme is available.
- JSDoc block comments everywhere.

Refactor:

- Refactor login/register pages to use reusable components.
- Keep forms using `...register`.
- Do not use `watch`.
- Do not use `Controller`.

Theme:

- Add `client/src/providers/AppThemeProvider.jsx`.
- Wire theme provider in `main.jsx` or `App.jsx`.
- Use provided theme files if present.
- If provided theme has its own exports, adapt to them instead of rewriting.

Update docs:

- `docs/phases/phase-5-summary.md`
- `docs/ARCHITECTURE.md` frontend design system section.

Manual verification:

- Run client.
- Confirm auth forms still work visually.
- Confirm no console errors.
- Confirm responsive behavior on mobile and desktop.

### Step 5: User Review And Feedback Integration

Present theme integration status, reusable components created, refactors done, and any missing theme files. Ask for explicit approval before Step 6.

### Step 6: Post-Git Requirement

After explicit approval only, complete Git status/fetch/diff/stage/commit/push/merge/delete/verify using commit message `feat: phase 5 theme and reusable mui components`.

## Phase Completion Criteria

- Theme provider exists.
- Reusable MUI layer exists.
- Auth pages use reusable form controls.
- Full theme integrated or pending clearly documented because files were not provided.
