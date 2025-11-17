import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';

export function Landing() {
  const { t } = useTranslation();
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
      <Paper elevation={3} sx={{ maxWidth: 1200, width: '100%', p: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h3" gutterBottom>
              {t('landingTitle')}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {t('landingSubtitle')}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="contained" component={RouterLink} to="/auth/login">
                {t('login')}
              </Button>
              <Button variant="outlined" component={RouterLink} to="/auth/register">
                {t('ctaRegister')}
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6">{t('tariffsTitle')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('tariffsSubtitle')}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {t('stackNote')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
