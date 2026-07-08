# Phase 4 - Frontend Foundation, Routing, And Auth Pages

## Phase Goal

Create the Vite React frontend foundation with MUI, React Router, Redux Toolkit, error boundary, toast setup, API client, public landing page, authentication pages, and protected route scaffolding.

## Mandatory Phase Protocol

### Step 1: Pre-Git Requirement

Run `git status`, `git branch -vv`, and `git fetch origin`. Handle missing remote, uncommitted changes, behind branches, and conflicts exactly as required. Create `phase-4-frontend-foundation-routing-auth`. Verify state before implementation.

### Step 2: Comprehensive And Extremely Deep Codebase Analysis

Read all client package files, backend auth endpoints, docs, constants, previous phase summaries, and current project structure.

### Step 3: Comprehensive And Extremely Deep Analysis Of Previously Implemented All Phases

Analyze Phases 1-3. Confirm frontend API routes match backend auth/profile endpoints.

### Step 4: Phase Execution Without Deviation

Implement client foundation under `client/src`.

Required structure:

```text
client/index.html
client/src/main.jsx
client/src/App.jsx
client/src/routes/AppRoutes.jsx
client/src/routes/ProtectedRoute.jsx
client/src/pages/public/LandingPage.jsx
client/src/pages/auth/LoginPage.jsx
client/src/pages/auth/RegisterPage.jsx
client/src/pages/auth/OAuthCallbackPage.jsx
client/src/pages/errors/NotFoundPage.jsx
client/src/store/store.js
client/src/store/authSlice.js
client/src/services/apiClient.js
client/src/services/authApi.js
client/src/utils/constants.js
client/src/utils/routePaths.js
client/src/components/layout/PublicLayout.jsx
client/src/components/feedback/AppToastContainer.jsx
client/src/components/feedback/AppErrorBoundary.jsx
```

Frontend rules:

- JavaScript only.
- MUI imports must be tree-shaking imports.
- Use `react-router`.
- Use `react-hook-form` with `...register`.
- Do not use `watch`.
- Do not use `Controller`.
- Use English app labels only.
- Use MUI `sx` and theme-aware values.
- Do not add custom theme yet beyond a minimal safe MUI default wrapper if needed. The full theme is Phase 5.
- Do not use Tailwind.
- Do not add tests.
- Every component/module gets JSDoc block comments.

Landing page:

- Public.
- Clear product purpose for daily supervisor reports.
- Call-to-action to login/register.
- Responsive for mobile and desktop.
- Do not make it a generic oversized marketing hero.

Auth pages:

- Register: name, email, password, confirm password.
- Login: email, password.
- Buttons and validation messages in English.
- Add placeholder OAuth provider section that calls backend providers endpoint and shows available configured providers.
- Use `MuiTextField` only if reusable components already exist; otherwise use direct MUI components and refactor in Phase 5.

API:

- `apiClient` uses `VITE_API_BASE_URL`.
- Include credentials for cookie auth.
- Normalize API errors.
- Do not expose backend secrets.

State:

- Store authenticated user.
- Support loading/error statuses.
- Fetch current user on app start.

Protected routing:

- Protected shell can be placeholder for now.
- Redirect unauthenticated users to login.

Update docs:

- `docs/phases/phase-4-summary.md`
- `README.md` frontend commands if needed.
- `docs/ARCHITECTURE.md` frontend section.

Manual verification:

- Run client dev server.
- Visit landing page.
- Register/login against backend if backend is running.
- Confirm protected route redirect behavior.

### Step 5: User Review And Feedback Integration

Present frontend routes, auth flow, commands run, and screenshots/visual notes if available. Ask for explicit approval before Step 6.

### Step 6: Post-Git Requirement

After explicit approval only, complete Git status/fetch/diff/stage/commit/push/merge/delete/verify using commit message `feat: phase 4 frontend foundation routing and auth`.

## Phase Completion Criteria

- Client app runs.
- Landing page exists.
- Auth pages exist.
- API client and auth state exist.
- Protected route scaffold works.
