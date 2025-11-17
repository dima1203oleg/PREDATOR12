import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';

export function GeoGlobe() {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('geoGlobeTitle')}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">{t('geoGlobeDescription')}</Typography>
        <Box sx={{ mt: 2, height: 360, bgcolor: 'background.default' }}>{t('geoGlobePlaceholder')}</Box>
      </Paper>
    </Box>
  );
}
