/**
 * Reusable MUI Card wrapper.
 *
 * Wrapped with forwardRef. Provides consistent card styling for forms and content blocks.
 *
 * @module components/reusable/MuiCard
 */
import { forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {object} [props.sx] - Additional sx styles for the Card
 * @param {React.Ref} ref
 * @returns {JSX.Element}
 */
const MuiCard = forwardRef(({ children, sx, ...props }, ref) => {
  return (
    <Card ref={ref} sx={{ width: '100%', ...sx }} {...props}>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
});

MuiCard.displayName = 'MuiCard';

export default MuiCard;
