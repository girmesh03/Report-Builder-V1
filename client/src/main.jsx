/**
 * Entry point.
 *
 * Configures the Redux store and React Router data mode router.
 *
 * @module main
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import "@fontsource/inter";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { store } from "./store/store.js";
import App from "./App.jsx";
import LandingPage from "./pages/public/LandingPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import OAuthCallbackPage from "./pages/auth/OAuthCallbackPage.jsx";
import NotFoundPage from "./pages/errors/NotFoundPage.jsx";
import PublicLayout from "./components/layout/PublicLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import ReportsPage from "./pages/reports/ReportsPage.jsx";
import CreateReportPage from "./pages/reports/CreateReportPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <LandingPage /> },
          {
            element: <PublicRoute />,
            children: [
              { path: "login", element: <LoginPage /> },
              { path: "register", element: <RegisterPage /> },
              { path: "oauth/callback", element: <OAuthCallbackPage /> },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppShell />,
            children: [
              { path: "dashboard", element: <DashboardPage /> },
              { path: "reports", element: <ReportsPage /> },
              { path: "reports/:id", element: <CreateReportPage /> },
              { path: "profile", element: <ProfilePage /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router} />
      </LocalizationProvider>
    </Provider>
  </StrictMode>,
);
