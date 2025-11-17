import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';

export function Settings() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Налаштування
      </Typography>
      <Paper sx={{ p: 2 }}>
        <FormGroup>
          <FormControlLabel control={<Switch defaultChecked />} label="Dark Mode" />
          <FormControlLabel control={<Switch />} label="UA/EN" />
        </FormGroup>
        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Розмір шрифту / Accessibility
        </Typography>
        <Slider defaultValue={14} min={12} max={22} aria-label="font-size" />
      </Paper>
    </Box>
  );
}
