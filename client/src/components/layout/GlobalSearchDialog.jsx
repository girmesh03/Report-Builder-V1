/**
 * Global search dialog.
 *
 * Responsive: fullScreen on mobile (xs-md), centered dialog with
 * border-radius on tablet+. Only the search result section scrolls.
 * Results grouped by entity type using MUI Accordion.
 * Uses react-hook-form useForm for uncontrolled input.
 * Search triggered only on search icon click or Enter key press.
 *
 * @module components/layout/GlobalSearchDialog
 */
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MuiDialog from '../reusable/MuiDialog.jsx';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import MuiTextField from '../reusable/MuiTextField.jsx';
import { listReports } from '../../services/reportsApi.js';
import { listBranches } from '../../services/branchesApi.js';

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {function} props.onClose
 * @returns {JSX.Element}
 */
function GlobalSearchDialog({ open, onClose }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { register, handleSubmit, reset } = useForm({ mode: 'onSubmit', defaultValues: { search: '' } });
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [branches, setBranches] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const doSearch = useCallback(({ search }) => {
    const trimmed = (search || '').trim();
    if (!trimmed) return;
    setLoading(true);
    setHasSearched(true);
    setSubmittedQuery(trimmed);
    const params = { search: trimmed, limit: 5 };
    Promise.all([
      listReports({ ...params, page: 1 }),
      listBranches({ ...params, page: 1 }),
    ])
      .then(([reportsRes, branchesRes]) => {
        setReports(reportsRes.data?.docs || []);
        setBranches(branchesRes.data?.docs || []);
      })
      .catch(() => {
        setReports([]);
        setBranches([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleClose = useCallback(() => {
    reset({ search: '' });
    setSubmittedQuery('');
    setReports([]);
    setBranches([]);
    setHasSearched(false);
    closeRef.current();
  }, [reset]);

  const handleResultClick = useCallback((type, id) => {
    handleClose();
    if (type === 'report') {
      navigateRef.current(`/reports/${id}`);
    } else if (type === 'branch') {
      navigateRef.current('/reports', { state: { branch: id } });
    }
  }, [handleClose]);

  const hasResults = reports.length > 0 || branches.length > 0;
  const totalResults = reports.length + branches.length;

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: 'background.default',
            ...(isMobile ? { borderRadius: 0 } : { borderRadius: 2 }),
          },
        },
      }}
    >
      <Stack sx={{ flexDirection: 'column', height: '100%' }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ p: 2, pb: 1, flexShrink: 0, alignItems: 'center' }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <form onSubmit={handleSubmit(doSearch)}>
              <MuiTextField
                fullWidth
                placeholder="Search reports, branches..."
                autoFocus
                {...register('search')}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          size="small"
                          type="button"
                          onClick={() => {
                            reset({ search: '' });
                            setSubmittedQuery('');
                            setReports([]);
                            setBranches([]);
                            setHasSearched(false);
                            closeRef.current();
                          }}
                          sx={{ cursor: 'pointer', p: 0 }}
                        >
                          <ArrowBackIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          type="button"
                          onClick={() => {
                            reset({ search: '' });
                            setSubmittedQuery('');
                            setReports([]);
                            setBranches([]);
                            setHasSearched(false);
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          type="submit"
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </form>
          </Box>
        </Stack>
        <DialogContent sx={{ overflowY: 'auto', pt: 1 }}>
          {loading && (
            <Stack sx={{ mt: 4, alignItems: 'center' }}>
              <CircularProgress size={24} />
            </Stack>
          )}
          {!loading && hasSearched && submittedQuery && !hasResults && (
            <Stack sx={{ mt: 6, alignItems: 'center', textAlign: 'center' }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  backgroundColor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <SearchOffIcon sx={{ fontSize: 36, color: 'text.disabled' }} />
              </Box>
              <Typography variant="body1" fontWeight={600} color="text.secondary">
                No results found
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
                No matches for &ldquo;{submittedQuery}&rdquo;
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ mt: 1 }}>
                Try a different search term
              </Typography>
            </Stack>
          )}
          {!loading && hasSearched && hasResults && (
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                {totalResults} result{totalResults !== 1 ? 's' : ''} found
              </Typography>
              {reports.length > 0 && (
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <DescriptionIcon fontSize="small" color="action" />
                      <Typography variant="body2" fontWeight={600}>Reports</Typography>
                      <Chip label={reports.length} size="small" />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense disablePadding>
                      {reports.map((r) => (
                        <ListItemButton
                          key={r._id}
                          onClick={() => handleResultClick('report', r._id)}
                          sx={{ borderRadius: 1 }}
                        >
                          <ListItemText
                            primary={`${r.supervisorName || 'Report'} — ${new Date(r.reportDate).toLocaleDateString()}`}
                            secondary={
                              (r.branches || []).map((b) => b.name).join(', ') ||
                              r.notes?.slice(0, 80)
                            }
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}
              {branches.length > 0 && (
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <AccountTreeIcon fontSize="small" color="action" />
                      <Typography variant="body2" fontWeight={600}>Branches</Typography>
                      <Chip label={branches.length} size="small" />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense disablePadding>
                      {branches.map((b) => (
                        <ListItemButton
                          key={b._id}
                          onClick={() => handleResultClick('branch', b._id)}
                          sx={{ borderRadius: 1 }}
                        >
                          <ListItemText
                            primary={b.name}
                            secondary={b.code}
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}
            </Stack>
          )}
          {!loading && !hasSearched && (
            <Stack sx={{ mt: 6, alignItems: 'center' }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  backgroundColor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <SearchIcon sx={{ fontSize: 36, color: 'text.disabled' }} />
              </Box>
              <Typography variant="body2" color="text.disabled">
                Type a query and press Enter or click the search icon
              </Typography>
            </Stack>
          )}
        </DialogContent>
      </Stack>
    </MuiDialog>
  );
}

export default GlobalSearchDialog;
