# Phase 6 - Dashboard Shell And Profile Page

## Phase Goal

Build the protected application shell with responsive sidebar, top bar, dashboard overview, profile page, and navigation foundation for Reports.

## Mandatory Phase Protocol

### Step 1: Pre-Git Requirement

Run `git status`, `git branch -vv`, and `git fetch origin`. Handle missing remote, uncommitted changes, behind branches, and conflicts exactly as required. Create `phase-6-dashboard-shell-profile-page`. Verify state before implementation.

### Step 2: Comprehensive And Extremely Deep Codebase Analysis

Read all frontend layout, routes, auth state, reusable MUI components, theme integration, backend profile API, docs, and previous phase summaries.

### Step 3: Comprehensive And Extremely Deep Analysis Of Previously Implemented All Phases

Analyze Phases 1-5 for architecture, styling, auth flow, and reusable component rules.

### Step 4: Phase Execution Without Deviation

Implement protected UI shell.

Required frontend files:

```text
client/src/components/layout/AppShell.jsx
client/src/components/layout/AppSidebar.jsx
client/src/components/layout/AppTopbar.jsx
client/src/components/layout/AppContent.jsx
client/src/pages/dashboard/DashboardPage.jsx
client/src/pages/profile/ProfilePage.jsx
client/src/pages/reports/ReportsPlaceholderPage.jsx
client/src/services/profileApi.js
client/src/store/profileSlice.js
```

App shell:

- Protected routes render inside `AppShell`.
- Sidebar includes:
  - Dashboard
  - Reports
  - Profile
  - Logout
- Sidebar responsive behavior:
  - Permanent/expanded on larger screens.
  - Drawer/toggle on mobile.
- Top bar includes page title and user menu.
- Use icons from `@mui/icons-material`.
- Use MUI responsive `sx`.
- No overlapping text or controls.
- No nested cards.

Dashboard:

- Show useful placeholders connected to future data:
  - total reports
  - draft reports
  - generated reports
  - recent activity placeholder
- Make visible progress even if backend reports are not implemented yet.

Profile page:

- Fetch profile from backend.
- Show editable name and phone/avatar URL if supported.
- Change password form.
- Use `react-hook-form` with `...register`.
- Do not use `watch`.
- Do not use `Controller`.
- Use reusable MUI components.

Logout:

- Calls backend logout.
- Clears frontend auth state.
- Redirects to login.

Update routes:

- `/dashboard`
- `/reports`
- `/profile`

Update docs:

- `docs/phases/phase-6-summary.md`
- `docs/ARCHITECTURE.md` protected shell section.

Manual verification:

- Login.
- Navigate protected pages.
- Update profile.
- Logout.
- Check mobile and desktop layout.

### Step 5: User Review And Feedback Integration

Present shell, pages, responsive behavior, profile behavior, commands run, and any issues. Ask for explicit approval before Step 6.

### Step 6: Post-Git Requirement

After explicit approval only, complete Git status/fetch/diff/stage/commit/push/merge/delete/verify using commit message `feat: phase 6 dashboard shell and profile page`.

## Phase Completion Criteria

- Protected shell works.
- Dashboard page exists.
- Profile page works with backend.
- Reports placeholder route exists.
