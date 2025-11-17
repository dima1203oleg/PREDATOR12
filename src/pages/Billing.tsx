import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';

const plans = [
  { nameKey: 'planClientName', features: ['featureFeed', 'featureChat', 'featureEtlStatus'], ctaKey: 'ctaUpgradeClient' },
  { nameKey: 'planProName', features: ['featurePiiAudit', 'featureOpenSearch', 'feature3dGlobe'], ctaKey: 'ctaUpgradePro' },
  { nameKey: 'planAdminName', features: ['featureMonitoring', 'featureAgentsMap', 'featureAccessControl'], ctaKey: 'ctaRequestAdmin' }
];

export function Billing() {
  const { t } = useTranslation();
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('billingPageTitle')}
      </Typography>
      <Grid container spacing={2}>
        {plans.map((plan) => (
          <Grid key={plan.nameKey} size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{t(plan.nameKey)}</Typography>
                {plan.features.map((featureKey) => (
                  <Typography key={featureKey} variant="body2" color="text.secondary">
                    • {t(featureKey)}
                  </Typography>
                ))}
              </CardContent>
              <CardActions>
                <Button fullWidth variant="contained">
                  {t(plan.ctaKey)}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
