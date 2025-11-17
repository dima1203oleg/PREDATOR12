import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export function Monitoring() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Monitoring / Observability
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">Grafana / Loki / Tempo embedded via iframe (lazy-load).</Typography>
        <Box sx={{ mt: 2, height: 320, bgcolor: 'background.default' }}>Grafana iframe placeholder</Box>
      </Paper>
    </Box>
  );
}
