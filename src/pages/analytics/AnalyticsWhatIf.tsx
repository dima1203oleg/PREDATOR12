import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

export function AnalyticsWhatIf() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        What-if Симулятор
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>Параметри сценарію</Typography>
        <Slider defaultValue={30} aria-label="Scenario" />
        <Button variant="contained">Запустити симуляцію</Button>
      </Paper>
    </Box>
  );
}
