/**
 * Audio recording guidelines.
 *
 * Shows tips for clear audio recording including environment,
 * language, and file size guidance per ADR-005.
 *
 * @module components/audio/AudioGuidelines
 */
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/**
 * @returns {JSX.Element}
 */
function AudioGuidelines() {
  const guidelines = [
    'Speak clearly in Amharic at a normal pace.',
    'Record in a quiet environment for best transcription accuracy.',
    'Mention the date, branch names, activities, issues, and work hours.',
    'Describe what happened at each branch you visited.',
    'Maximum file size is 10 MB. If exceeded, re-record a shorter clip.',
    'There is no fixed time limit — record as long as needed.',
  ];

  return (
    <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
      <CardContent>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
        >
          <InfoOutlinedIcon fontSize="small" />
          Recording Tips
        </Typography>
        <List dense disablePadding>
          {guidelines.map((text, index) => (
            <ListItem key={index} sx={{ px: 0, py: 0.25 }}>
              <ListItemText
                primary={text}
                slotProps={{ primaryTypography: { variant: 'caption', color: 'text.secondary' } }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default AudioGuidelines;
