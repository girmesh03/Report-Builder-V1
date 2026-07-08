/**
 * Entry point.
 *
 * Configures the Redux store and React Router data mode router.
 *
 * @module main
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { store } from './store/store.js';
import App from './App.jsx';
import LandingPage from './pages/public/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage.jsx';
import NotFoundPage from './pages/errors/NotFoundPage.jsx';
import PublicLayout from './components/layout/PublicLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <LandingPage /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
          { path: 'oauth/callback', element: <OAuthCallbackPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <div>Dashboard (coming soon)</div> },
          { path: 'reports', element: <div>Reports (coming soon)</div> },
          { path: 'profile', element: <div>Profile (coming soon)</div> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
