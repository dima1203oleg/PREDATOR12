import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';

export function DeepAnalytics() {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('deepAnalyticsTitle')}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">{t('deepAnalyticsDescription')}</Typography>
        <Box sx={{ mt: 2, height: 320, bgcolor: 'background.default' }}>{t('deepAnalyticsPlaceholder')}</Box>
      </Paper>
    </Box>
  );
}
