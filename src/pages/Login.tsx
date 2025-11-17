import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useAuthStore } from '../state/authStore';

export function Login() {
  const navigate = useNavigate();
  const setRole = useAuthStore((state) => state.setRole);
  const setUsername = useAuthStore((state) => state.setUsername);

  const handleLogin = (role: 'client' | 'pro' | 'admin') => {
    setRole(role);
    setUsername(role.toUpperCase());
    navigate('/_app/feed');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
      <Paper sx={{ width: 420, p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Login via Keycloak (mock)
        </Typography>
        <Stack spacing={2}>
          <TextField label="Username" fullWidth />
          <TextField label="Password" type="password" fullWidth />
          <Button variant="contained" onClick={() => handleLogin('client')}>
            Sign in as Client
          </Button>
          <Button variant="outlined" onClick={() => handleLogin('pro')}>
            Sign in as Pro
          </Button>
          <Button variant="outlined" onClick={() => handleLogin('admin')}>
            Sign in as Admin
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
