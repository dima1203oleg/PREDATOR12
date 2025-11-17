import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';

const plans = [
  { name: 'Client', features: ['My Daily Feed', 'Chat-Аналiтик', 'ETL status'], cta: 'Upgrade to Client' },
  { name: 'Pro', features: ['PII reveal logging', 'OpenSearch Dashboards', '3D Globe'], cta: 'Upgrade to Pro' },
  { name: 'Admin', features: ['Monitoring', 'Agents Map', 'Access control'], cta: 'Request Admin' }
];

export function Billing() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Billing
      </Typography>
      <Grid container spacing={2}>
        {plans.map((plan) => (
          <Grid key={plan.name} size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{plan.name}</Typography>
                {plan.features.map((f) => (
                  <Typography key={f} variant="body2" color="text.secondary">
                    • {f}
                  </Typography>
                ))}
              </CardContent>
              <CardActions>
                <Button fullWidth variant="contained">
                  {plan.cta}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
