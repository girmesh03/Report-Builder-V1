# Phase 4 Summary — Frontend Foundation, Routing, And Auth Pages

## Overview

Phase 4 implements the complete frontend client foundation: React Router data mode routing, Redux Toolkit auth state management, fetch-based API client with 401→refresh→SESSION_EXPIRED pattern, public/auth/error page shell, reusable MUI wrapper components (MuiTextField, MuiPasswordField, MuiButton, MuiCard), fixed AppBar + scrollable content layout, dark/light theme toggle, and comprehensive MUI deprecated-prop remediation across all existing client files.

## Created Files

### Entry, Layout, Feedback (5 files)

| File | Purpose |
|---|---|
| `client/src/main.jsx` | Entry point — Redux Provider + `createBrowserRouter` data mode via `RouterProvider` |
| `client/src/App.jsx` | Root layout — `AppTheme`, `CssBaseline`, `AppErrorBoundary`, `AppToastContainer`, `<Outlet />`, `useEffect` → `fetchCurrentUser()` on mount |
| `client/src/components/layout/PublicLayout.jsx` | Public layout — `PublicAppBar` (fixed) + scrollable content area |
| `client/src/components/layout/PublicAppBar.jsx` | AppBar with logo (clickable → navigates to `/`), title, dark/light theme toggle via `useColorScheme` |
| `client/src/components/feedback/AppErrorBoundary.jsx` | Error boundary — "Something went wrong" fallback + "Try again" button |
| `client/src/components/feedback/AppToastContainer.jsx` | react-toastify container — `position="bottom-right"`, `autoClose={3000}`, `newestOnTop` |

### Auth, State, Utils (6 files)

| File | Purpose |
|---|---|
| `client/src/services/apiClient.js` | Fetch wrapper — `VITE_API_BASE_URL`, `credentials: 'include'`, 401→`/auth/refresh`→retry, `SESSION_EXPIRED` on refresh failure |
| `client/src/services/authApi.js` | Auth API functions: `register`, `login`, `logout`, `refresh`, `getMe`, `getProviders` |
| `client/src/store/store.js` | Redux store configuration |
| `client/src/store/authSlice.js` | Auth state — `register`/`login`/`logout`/`fetchCurrentUser` thunks, `clearAuth` action, `clearError` reducer, `initializing` state |
| `client/src/utils/constants.js` | Frontend constants — `AUTH_ROUTES`, `PROTECTED_ROUTES` |
| `client/src/utils/routePaths.js` | Route path constants: `HOME`, `LOGIN`, `REGISTER`, `OAUTH_CALLBACK`, `DASHBOARD`, `REPORTS`, `PROFILE` |

### Pages (5 files)

| File | Purpose |
|---|---|
| `client/src/pages/public/LandingPage.jsx` | Landing page — hero section with CTA buttons (Get Started → /register, Sign In → /login) |
| `client/src/pages/auth/LoginPage.jsx` | Login form — MuiCard, MuiTextField (email + EmailIcon), MuiPasswordField (password + LockIcon + eye toggle), OAuth providers section, button `size="small"` |
| `client/src/pages/auth/RegisterPage.jsx` | Register form — MuiCard, MuiTextField (name, email + EmailIcon), MuiPasswordField (password + confirm + LockIcon + eye toggle), button `size="small"` |
| `client/src/pages/auth/OAuthCallbackPage.jsx` | OAuth callback handler placeholder |
| `client/src/pages/errors/NotFoundPage.jsx` | 404 page — SVG illustration (`notFound_404.svg`), 100vh centered, "Go back" + "Go home" |

### Routing (1 file)

| File | Purpose |
|---|---|
| `client/src/routes/ProtectedRoute.jsx` | Auth guard — spinner during `initializing`, redirect to `/login` with `state.from` if unauthenticated |

### Reusable MUI Wrappers (4 files — created in Phase 4, originally planned for Phase 5)

| File | Purpose |
|---|---|
| `client/src/components/reusable/MuiTextField.jsx` | TextField wrapper, `forwardRef`, default `size="small"`, adornments via `slotProps.input` |
| `client/src/components/reusable/MuiPasswordField.jsx` | Password field, `forwardRef`, eye toggle endAdornment (no layout shift), merges caller's slotProps |
| `client/src/components/reusable/MuiButton.jsx` | Button wrapper, `forwardRef` |
| `client/src/components/reusable/MuiCard.jsx` | Card + CardContent wrapper, `forwardRef` |

### Assets (1 file)

| File | Purpose |
|---|---|
| `client/src/assets/notFound_404.svg` | Custom 404 illustration |

## Route Structure

| Path | Component | Auth |
|---|---|---|
| `/` | PublicLayout → LandingPage | Public |
| `/login` | PublicLayout → LoginPage | Public |
| `/register` | PublicLayout → RegisterPage | Public |
| `/oauth/callback` | PublicLayout → OAuthCallbackPage | Public |
| `/dashboard` | ProtectedRoute → NotFoundPage | Protected |
| `/reports` | ProtectedRoute → NotFoundPage | Protected |
| `/profile` | ProtectedRoute → NotFoundPage | Protected |
| `*` | NotFoundPage | Public |

## Key Decisions

### Architecture

- **React Router data mode** via `createBrowserRouter` + `RouterProvider`. Routes as a flat array defined inline in `main.jsx` (no separate `AppRoutes.jsx`).
- **Redux Toolkit** `authSlice` handles all auth state (`user`, `isAuthenticated`, `loading`, `error`, `initializing`).
- **`fetchCurrentUser` on app mount** in `App.jsx` `useEffect` hydrates auth state from httpOnly cookies.

### API Client

- **Native `fetch`** — no axios, no wrapper library.
- **401→refresh→retry**: Catches 401, attempts `/auth/refresh` via direct `fetch` (not apiClient — avoids circular dependency), on success retries original request, on failure throws `SESSION_EXPIRED` (dispatched as toast + `clearAuth`).
- **Auth endpoints excluded** from 401 handling: `login`, `register`, `refresh`, `logout` should never auto-refresh.
- **`clearAuth` action** available for external dispatch (e.g., from apiClient 401 handler).
- **`credentials: 'include'`** on all requests.

### Layout

- **Fixed AppBar + scrollable content**: Outer wrapper `height: 100vh; overflow: hidden`, AppBar fixed, content area `overflow-y: auto`.
- **Dark/light theme toggle**: MUI `useColorScheme` hook, toggles between `'light'` and `'dark'`, persisted by MUI theme provider.

### Auth Pages

- **MuiCard wrapper** for form cards (`maxWidth={400}`).
- **MuiPasswordField eye toggle**: `useState` for show/hide, `useCallback` handlers, `onMouseDown` prevents focus loss, `type` switches between `'password'` and `'text'`. No layout shift — eye icon replaces the lock icon area.
- **`getValues` over `watch`** for confirmPassword validation — avoids restricted `watch`.
- **Button `size="small"`** on all form submit buttons.
- **OAuth providers section**: Placeholder fetches `getProviders` from backend.

### 404 Page

- SVG illustration via native `<img>` (not `Box component="img"`).
- **100vh centering**, "Go back" + "Go home" buttons.

## Violations Found And Fixed

| Violation | Occurrences | Fix |
|---|---|---|
| `margin="normal"` on TextField | 6 (LoginPage, RegisterPage) | `sx={{ mb: 2 }}` |
| `InputProps` on TextField | 6 (LoginPage, RegisterPage) | `slotProps={{ input: { startAdornment: ... } }}` |
| `Box component="form"` | 2 (LoginPage, RegisterPage) | Native `<form>` element |
| `Box component="img"` | 1 (NotFoundPage) | Native `<img>` element |
| `Link component="button"` | 2 (NotFoundPage, AppErrorBoundary) | `Link slots={{ root: 'button' }}` |
| Unused `catch(error)` | 1 (apiClient) | `catch {}` |
| `watch` usage | 1 (RegisterPage) | `getValues` in validate function |
| Unused `Box` import | 1 (RegisterPage) | Remove unused import |
| `size="large"` on buttons | 2 (LoginPage, RegisterPage) | `size="small"` |

34 client files reviewed and fixed. Build passes: `npx vite build` — 1826 modules, 0 errors.

## Deviations From Phase 4 Spec

1. **Reusable MUI wrappers in Phase 4 instead of Phase 5**: Spec said "use MuiTextField only if already exist; otherwise use direct MUI components." User explicitly requested creating 4 wrappers in Phase 4. Phase 5 now focuses on remaining wrappers (MuiSelect, MuiDatePicker, MuiDialog, MuiDataGrid, MuiPageHeader, MuiEmptyState, MuiLoadingState, MuiErrorState).
2. **No `AppRoutes.jsx`**: Routes defined inline in `main.jsx` — no separate route file needed.
3. **Theme toggle in Phase 4**: Spec said "Do not add custom theme yet." But MUI's built-in `useColorScheme` was used in PublicAppBar — this is MUI-native, not custom theme work.
4. **No JSDoc on components**: Per spec requirement, deferred to a later phase if needed.
5. **Protected route placeholders render NotFoundPage**: Future-phase pages redirect to NotFoundPage — intentional since not yet implemented.

## MUI Prop Rules (Must Follow In All Future Phases)

- **Never use `margin="normal"`** — use `sx={{ mb: 2 }}`.
- **Never use `InputProps`** — use `slotProps={{ input: { ... } }}`.
- **Never use `component` prop** on Box/Link/Button — use native elements or `slots={{ root: 'button' }}`.
- **Never use `watch`** unless documented with a code comment — use `getValues` in validate.
- **Use `size="small"`** on form buttons.

## Patterns Established For Future Phases

Every pattern below is an architectural rule that future phases MUST respect.

### 1. Layout & Scroll Pattern (Applies To All Layouts)

**Rule:** The chrome (AppBar/Sidebar/Topbar) stays fixed. Only the content area scrolls.

```
Implementation (universal pattern):
  Outer container:  sx={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
  Chrome elements:  position fixed or part of the flex column (no scroll)
  Content area:     sx={{ overflowY: 'auto', flex: 1 }}
```

**Public layout** (`PublicLayout.jsx`): AppBar fixed at top → content scrolls below it.
**Protected layout** (future `AppShell.jsx` — Phase 6): AppTopbar + AppSidebar fixed → content scrolls in remaining area. Must use the SAME `height: 100vh; overflow: hidden` outer wrapper and `overflow-y: auto` on content. Never scroll the `<body>` or `<html>` — always use an inner content container.

**Anti-pattern (forbidden):** `overflow: auto` on `body`/`html`; `position: fixed` on content areas; nested scrollable containers without explicit height constraints.

### 2. API Client Pattern

**Rule:** All HTTP calls go through `client/src/services/apiClient.js`. Future API service files (e.g., `branchApi.js`, `reportApi.js`, `profileApi.js`) MUST import and use `apiClient`.

```
import apiClient from './apiClient.js';
const response = await apiClient('/api/v1/branches');
```

The 401→refresh→SESSION_EXPIRED interceptor is built into `apiClient`. Auth endpoints (`login`, `register`, `refresh`, `logout`) are excluded from auto-refresh — do NOT add them. All other endpoints get automatic 401 handling.

**Rule:** The refresh call uses direct `fetch` (not `apiClient`) to avoid circular dependency. This pattern is already implemented and must NOT be duplicated or changed.

### 3. Redux Slice Pattern

**Rule:** Future state slices MUST follow the same `createAsyncThunk` + `createSlice` pattern as `authSlice.js`:

```
export const someAction = createAsyncThunk('slice/action', async (data, { rejectWithValue }) => {
  try {
    const response = await someApi(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const slice = createSlice({
  name: 'slice',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(someAction.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(someAction.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(someAction.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});
```

**Rule:** Every slice must have its own `loading` and `error` state. Do NOT share auth state for non-auth features.

**Rule:** When `clearAuth` is dispatched (session expiry), all other slices should reset. This can be done via `extraReducers` listening to `clearAuth` or by dispatching a root reset action.

### 4. Route Registration Pattern

**Rule:** All routes are defined in `client/src/main.jsx` as a flat array under `createBrowserRouter`. New protected routes go inside the `ProtectedRoute` element's children array. New public routes go inside the `PublicLayout` element's children array.

```
// Adding a new protected page:
{ element: <ProtectedRoute />, children: [
  { path: 'dashboard', element: <DashboardPage /> },
  { path: 'settings',  element: <SettingsPage /> },  // <-- add here
]}

// Adding a new public page:
{ element: <PublicLayout />, children: [
  { path: 'about', element: <AboutPage /> },           // <-- add here
]}
```

**Rule:** Do NOT create a separate `AppRoutes.jsx` — keep routes in `main.jsx` unless the file becomes unmanageably large.

### 5. Component Creation Pattern

**Rule:** All reusable MUI wrappers in `client/src/components/reusable/` MUST:
- Be prefixed with `Mui` (e.g., `MuiSelect.jsx`)
- Use `forwardRef` for react-hook-form compatibility
- Set `displayName` on the wrapped component
- Default to `size="small"` where applicable (TextField, Select, Button)
- Pass through all standard MUI props (no custom API surface — pure wrappers)
- Use `slotProps.input` for input adornments (never `InputProps`)
- Never import from the barrel (`@mui/material`) — use tree-shaking imports

Phase 5 will create the remaining wrappers: MuiSelect, MuiDatePicker, MuiDialog, MuiDataGrid, MuiPageHeader, MuiEmptyState, MuiLoadingState, MuiErrorState. All must follow this pattern.

### 6. Auth Flow Pattern

**Rule:** The auth lifecycle is:
1. App mounts → `App.jsx` `useEffect` dispatches `fetchCurrentUser()`
2. `ProtectedRoute` checks `initializing` — shows spinner while true
3. After init: if `isAuthenticated` → render child routes; if not → `<Navigate to="/login">`
4. On 401 from any API call → apiClient auto-refreshes; if refresh fails → `SESSION_EXPIRED` → `clearAuth` → user redirected to login
5. Login/register pages do NOT call `fetchCurrentUser` — the login/register thunks set user directly

**Rule:** Double `fetchCurrentUser` on page refresh in development is NORMAL behavior caused by React `<StrictMode>` double-invoking effects. The production build fires once. Do NOT remove StrictMode to suppress this — it catches real side-effect bugs.

**Rule:** Future feature pages do NOT need to check `isAuthenticated` — `ProtectedRoute` already guards them. They can assume the user is authenticated when rendered.

### 7. Error Handling Pattern

**Rule:** Errors follow a 3-layer strategy:
- **API errors**: Caught in thunk `try/catch`, returned via `rejectWithValue`, stored in slice's `error` state
- **React errors**: Caught by `AppErrorBoundary` (wraps all routes in `App.jsx`) — shows fallback UI
- **Toast notifications**: Non-blocking errors (e.g., `SESSION_EXPIRED`) dispatched as toast messages via `react-toastify`

**Rule:** Future pages should NOT wrap themselves in individual error boundaries — let errors propagate to `AppErrorBoundary`. Use slice `error` state for inline error messages when needed.

### 8. Theme Pattern

**Rule:** Theme is configured in `client/src/theme/` and wired via `AppTheme` in `App.jsx`. Future components:
- Use `sx` prop or `styled()` for styling — never Tailwind or inline `style`
- Use theme-aware values (`theme.palette.*`, `theme.spacing()`, `theme.breakpoints.*`)
- Can toggle dark/light mode via MUI's `useColorScheme` hook (as implemented in `PublicAppBar.jsx`)
- Do NOT import or call `createTheme` directly — all customization goes through the existing theme customization files

### 9. react-hook-form Pattern

**Rule:** All forms MUST use `react-hook-form` with `register` only:
- No `watch` — use `getValues` in validate functions for cross-field validation
- No `Controller` — unless documented with a code comment explaining why `register` cannot work
- `formState.errors` for validation display
- Use MUI's `error` and `helperText` props on wrapped components

### 10. StrictMode Development Behavior

`client/src/main.jsx` wraps the app in `<StrictMode>`. In development mode, React 18+ intentionally double-invokes effects, which causes `fetchCurrentUser` to fire twice on every page refresh. This produces duplicate `GET /api/v1/auth/me` requests in the backend log. This is **normal and expected** — it only happens in development. The production build fires once. Do NOT remove StrictMode.

## Build Verification

- `npx oxlint` — 0 warnings, 0 errors
- `npx vite build` — 1826 modules, production bundle (635 KB JS, 14 KB CSS)
- Manual route navigation: `/`, `/login`, `/register`, `/oauth/callback`, `/*` render correctly
- ProtectedRoute redirect: `/dashboard` without auth → redirect to `/login` with `state.from`

## State After Phase 4

- Full route structure with auth state, error boundary, toast, 404 page.
- Auth pages with MuiCard forms, MuiTextField/MuiPasswordField with adornments and eye toggle, OAuth providers section.
- API client with 401→refresh→SESSION_EXPIRED.
- Auth state in Redux — register/login/logout/fetchCurrentUser thunks, clearAuth for session expiry.
- Protected routes guard future pages.
- Mui wrappers: MuiTextField, MuiPasswordField, MuiButton, MuiCard.
- PublicAppBar with logo navigation and dark/light theme toggle.
- Scrollable layout (AppBar fixed, content scrolls).
- Build verified with oxlint and vite build — 0 errors.
- Docs updated: AGENTS.md, ARCHITECTURE.md, README.md, DEVELOPMEMT_PHASES.md.

## Ready For Phase 5

Phase 5 continues with remaining MUI wrappers: MuiSelect, MuiDatePicker, MuiDialog, MuiDataGrid, MuiPageHeader, MuiEmptyState, MuiLoadingState, MuiErrorState. Future phases build on established patterns: 401 auto-refresh, scrollable layout, Mui wrappers with forwardRef, no deprecated MUI props.
