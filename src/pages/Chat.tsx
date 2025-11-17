import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export function Chat() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Chat-Аналітик (OpenWebUI)
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography color="text.secondary">
          Вбудований чат через iframe або API. Додати підтримку файлів, STT (🎙️), TTS (🔊), feedback 👍 👎.
        </Typography>
        <Box sx={{ mt: 2, height: 400, borderRadius: 2, overflow: 'hidden', bgcolor: 'background.default' }}>
          <iframe
            title="OpenWebUI"
            src="https://example.com/openwebui"
            style={{ width: '100%', height: '100%', border: 0 }}
          />
        </Box>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField fullWidth placeholder="Ask an AI analyst..." />
          <Button variant="contained">Send</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
