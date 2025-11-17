import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

export function Register() {
  const { t } = useTranslation();
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
      <Paper sx={{ width: 420, p: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t('registerTitle')}
        </Typography>
        <Stack spacing={2}>
          <TextField label={t('email')} fullWidth />
          <TextField label={t('password')} type="password" fullWidth />
          <Button variant="contained">{t('createAccount')}</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
