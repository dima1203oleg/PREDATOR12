import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

export function Feed() {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('feedTitle')}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{t('feedRisks')}</Typography>
            <Typography color="text.secondary">{t('feedRisksDescription')}</Typography>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">{t('feedRecommendations')}</Typography>
            <Typography color="text.secondary">{t('feedRecommendationsDescription')}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">{t('feedNotifications')}</Typography>
              <Typography color="text.secondary">{t('feedNotificationsDescription')}</Typography>
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">{t('feedWidgets')}</Typography>
              <Typography color="text.secondary">{t('feedWidgetsDescription')}</Typography>
              <Button size="small">{t('configure')}</Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
