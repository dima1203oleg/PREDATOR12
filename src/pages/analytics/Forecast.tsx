import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

export function Forecast() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Time Series Прогноз
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">Вибір датасету, експорт CSV/PDF, порівняння факт + прогноз.</Typography>
        <Button sx={{ mt: 2 }} variant="contained">
          Експорт CSV
        </Button>
      </Paper>
    </Box>
  );
}
