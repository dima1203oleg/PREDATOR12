import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import { useTranslation } from 'react-i18next';

export function Settings() {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('settingsTitle')}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <FormGroup>
          <FormControlLabel control={<Switch defaultChecked />} label={t('darkMode')} />
          <FormControlLabel control={<Switch />} label={t('languageToggle')} />
        </FormGroup>
        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          {t('fontSizeLabel')}
        </Typography>
        <Slider defaultValue={14} min={12} max={22} aria-label="font-size" />
      </Paper>
    </Box>
  );
}
