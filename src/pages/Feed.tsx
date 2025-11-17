import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export function Feed() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Daily Feed
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Key Risks</Typography>
            <Typography color="text.secondary">Аномалії та ризики за сьогодні з систем моніторингу.</Typography>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Agent Recommendations</Typography>
            <Typography color="text.secondary">Рекомендації агентів AI з урахуванням ролі користувача.</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">Notifications</Typography>
              <Typography color="text.secondary">WebSocket stream for ETL/alerts.</Typography>
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">Widgets</Typography>
              <Typography color="text.secondary">Drag, hide, reveal PII (Pro only with audit).</Typography>
              <Button size="small">Configure</Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
