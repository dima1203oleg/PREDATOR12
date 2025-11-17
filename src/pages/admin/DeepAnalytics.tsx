import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export function DeepAnalytics() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Глибинна Аналітика
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">OpenSearch Dashboards embedded через iframe з готовими дашбордами.</Typography>
        <Box sx={{ mt: 2, height: 320, bgcolor: 'background.default' }}>OpenSearch iframe placeholder</Box>
      </Paper>
    </Box>
  );
}
