import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

export function Forecast() {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('forecastTitle')}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">{t('forecastDescription')}</Typography>
        <Button sx={{ mt: 2 }} variant="contained">
          {t('download')}
        </Button>
      </Paper>
    </Box>
  );
}
