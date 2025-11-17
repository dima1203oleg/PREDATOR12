import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export function Register() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
      <Paper sx={{ width: 420, p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Реєстрація (Keycloak redirect mock)
        </Typography>
        <Stack spacing={2}>
          <TextField label="Email" fullWidth />
          <TextField label="Password" type="password" fullWidth />
          <Button variant="contained">Create account</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
