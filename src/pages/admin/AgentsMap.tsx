import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export function AgentsMap() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Мапа Агентів
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">Статуси сервісів MAS, затримка, кількість задач. Граф на D3/vis-network.</Typography>
        <Box sx={{ mt: 2, height: 320, bgcolor: 'background.default' }}>Agents map placeholder</Box>
      </Paper>
    </Box>
  );
}
