import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

const reports = [
  { name: 'Daily intelligence', status: 'Ready' },
  { name: 'Compliance digest', status: 'Generating' }
];

export function Reports() {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('reportsTitle')}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <List>
          {reports.map((report) => (
            <ListItem
              key={report.name}
              secondaryAction={<Button variant="outlined">{t('download')}</Button>}
            >
              <ListItemText primary={report.name} secondary={t('reportStatus', { status: report.status })} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained">{t('createReport')}</Button>
      </Paper>
    </Box>
  );
}
