# Phase 6 Summary — Dashboard Shell and Profile Page

## Completed

- **AppShell** — Protected application shell wiring AppTopbar, AppSidebar, and AppContent. Manages mobile sidebar state.
- **AppSidebar** — Responsive Drawer: permanent on `md+`, temporary/toggle on mobile. Nav items (Dashboard, Reports, Profile) at top with `flexGrow: 1`; Logout at bottom separated by Divider.
- **AppTopbar** — Fixed top bar with hamburger menu (mobile), dynamic page title from route, user avatar dropdown with Profile link and Logout.
- **AppContent** — Scrollable content area wrapping `<Outlet />` with toolbar spacer.
- **DashboardPage** — Summary stat cards (total, draft, generated reports) + recent activity placeholder. Uses MuiPageHeader, MuiLoadingState, MuiCard, Grid with `size` prop.
- **ProfilePage** — Two-column layout: Personal Information form (name, phone, avatarUrl) + Change Password form (currentPassword, newPassword). Uses react-hook-form with `register`, Mui wrappers (MuiTextField, MuiPasswordField, MuiButton with native loading props).
- **ReportsPlaceholderPage** — Placeholder using MuiEmptyState for Phase 8.
- **profileApi** — API service with `getProfile`, `updateProfile`, `changePassword`.
- **profileSlice** — Redux slice with `fetchProfile`, `updateProfile`, `changePassword` thunks; per-action loading/error states.

## Changes From Phase 6 Prompt

### Added (beyond prompt)
- **PublicRoute guard** — Redirects authenticated users to `/dashboard`. Wraps login, register, and oauth/callback pages. Generic — adding future public pages requires only nesting inside `<PublicRoute>`.
- **Logo smart navigation** — PublicAppBar logo clicks navigate to `/dashboard` if authenticated, else `/`.
- **Sidebar logout at bottom** — Logout moved below a Divider at the bottom of the sidebar, not interleaved with nav items.
- **3 user-experience fixes per user request** (logout placement, public route guard, logo behavior).

### Changes after user review
1. Logout moved to bottom of sidebar (separated by Divider, pushed down by `flexGrow: 1` on nav list).
2. PublicRoute created to restrict authenticated users from public auth pages.
3. PublicAppBar logo reads `isAuthenticated` from Redux and navigates accordingly.

## Files Created (9)

| File | Lines |
|---|---|
| `client/src/components/layout/AppShell.jsx` | 49 |
| `client/src/components/layout/AppSidebar.jsx` | 111 |
| `client/src/components/layout/AppTopbar.jsx` | 107 |
| `client/src/components/layout/AppContent.jsx` | 36 |
| `client/src/pages/dashboard/DashboardPage.jsx` | 78 |
| `client/src/pages/profile/ProfilePage.jsx` | 194 |
| `client/src/pages/reports/ReportsPlaceholderPage.jsx` | 30 |
| `client/src/services/profileApi.js` | 30 |
| `client/src/store/profileSlice.js` | 108 |
| `client/src/routes/PublicRoute.jsx` | 41 |

## Files Modified (3)

| File | Change |
|---|---|
| `client/src/main.jsx` | Added PublicRoute wrapper around auth pages; added AppShell nesting |
| `client/src/store/store.js` | Added profileReducer |
| `client/src/App.jsx` | Removed old direct route handling (moved to main.jsx data router) |

## Phase 6 Convention Verifications

- MUI tree-shaking imports ✅
- `size` prop on Grid (not `item`) ✅
- Mui wrappers with forwardRef where needed ✅
- react-hook-form with `register` only (no `watch`/`Controller`) ✅
- MuiButton native `loading`/`loadingIndicator`/`loadingPosition` props ✅
- Theme-aware `sx` (no hardcoded colors) ✅
- No deprecated MUI props ✅
- Fixed chrome + scrollable content pattern ✅
- JSDoc on all public modules/functions ✅
- Layout: `height: 100vh; overflow: hidden` outer, `overflow-y: auto` content ✅

## Phase 6 Completion Criteria

- [x] Protected shell works (responsive sidebar + top bar + content area)
- [x] Dashboard page exists (summary cards + recent activity placeholder)
- [x] Profile page works with backend (fetch + update + change password)
- [x] Reports placeholder route exists
- [x] Authenticated users cannot access public auth pages
- [x] Logo navigates to /dashboard for authenticated users
- [x] Build passes with 0 errors
