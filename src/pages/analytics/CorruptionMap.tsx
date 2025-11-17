import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';

export function CorruptionMap() {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('corruptionMapTitle')}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">{t('corruptionMapDescription')}</Typography>
        <Box sx={{ mt: 2, height: 360, bgcolor: 'background.default' }}>{t('corruptionMapPlaceholder')}</Box>
      </Paper>
    </Box>
  );
}
