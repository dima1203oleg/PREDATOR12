import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const pipeline = ['Завантаження', 'Парсинг', 'Валідація', 'Індексація', 'Готово'];

export function DataSources() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Джерела Даних
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography>Upload (drag & drop) + тип даних/період.</Typography>
        <Button variant="contained" sx={{ mt: 1 }}>
          Обрати файл
        </Button>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          ETL Pipeline (WebSocket статус)
        </Typography>
        <Stack spacing={2}>
          {pipeline.map((stage, idx) => (
            <Box key={stage}>
              <Typography variant="subtitle2">{stage}</Typography>
              <LinearProgress variant={idx < 3 ? 'determinate' : 'indeterminate'} value={idx * 25} />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
