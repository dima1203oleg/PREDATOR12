import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export function CorruptionMap() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Карта корупції / лобізму
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">
          Візуалізація мережі (vis-network) з маскуванням PII для Client та перемикачем для Pro.
        </Typography>
        <Box sx={{ mt: 2, height: 360, bgcolor: 'background.default' }}>Graph placeholder</Box>
      </Paper>
    </Box>
  );
}
