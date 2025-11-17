import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';

export function AgentsMap() {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('agentsMapTitle')}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">{t('agentsMapDescription')}</Typography>
        <Box sx={{ mt: 2, height: 320, bgcolor: 'background.default' }}>{t('agentsMapPlaceholder')}</Box>
      </Paper>
    </Box>
  );
}
