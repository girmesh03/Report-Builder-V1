/**
 * Application-level theme provider.
 *
 * Wraps the core AppTheme (createTheme + customizations) so that
 * App.jsx only needs to import from the providers layer rather than
 * the raw theme config. This separation keeps the theme config
 * distinct from the application's provider wiring.
 *
 * @module providers/AppThemeProvider
 */
import AppTheme from '../theme/AppTheme.jsx';

/**
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
function AppThemeProvider({ children }) {
  return <AppTheme>{children}</AppTheme>;
}

export default AppThemeProvider;
