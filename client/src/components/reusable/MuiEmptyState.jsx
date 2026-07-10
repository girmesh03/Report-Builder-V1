/**
 * Reusable empty-state component.
 *
 * Centered column layout with optional icon (56px, text.secondary),
 * title (h6), description (body2, text.secondary), and action button.
 * Theme-aware sx — no direct themePrimitives imports.
 *
 * @module components/reusable/MuiEmptyState
 */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiButton from './MuiButton.jsx';

/**
 * @param {object} props
 * @param {React.ElementType} [props.icon] - Icon component rendered at 56px
 * @param {string} props.title - Empty-state heading
 * @param {string} [props.description] - Supporting text
 * @param {string} [props.actionLabel] - CTA button label
 * @param {() => void} [props.onAction] - CTA click handler
 * @returns {JSX.Element}
 */
function MuiEmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
      }}
    >
      {Icon && <Icon sx={{ fontSize: 56, color: 'text.secondary', mb: 2 }} />}
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 400 }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <MuiButton variant="contained" onClick={onAction} size="small">
          {actionLabel}
        </MuiButton>
      )}
    </Box>
  );
}

MuiEmptyState.displayName = 'MuiEmptyState';

export default MuiEmptyState;
