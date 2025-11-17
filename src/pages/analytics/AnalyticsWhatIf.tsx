import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';

export function AnalyticsWhatIf() {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('whatIfTitle')}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>{t('scenarioParameters')}</Typography>
        <Slider defaultValue={30} aria-label="Scenario" />
        <Button variant="contained">{t('runSimulation')}</Button>
      </Paper>
    </Box>
  );
}
