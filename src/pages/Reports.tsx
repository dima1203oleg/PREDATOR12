import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';

const reports = [
  { name: 'Daily intelligence', status: 'Ready' },
  { name: 'Compliance digest', status: 'Generating' }
];

export function Reports() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Звіти
      </Typography>
      <Paper sx={{ p: 2 }}>
        <List>
          {reports.map((report) => (
            <ListItem
              key={report.name}
              secondaryAction={<Button variant="outlined">Download</Button>}
            >
              <ListItemText primary={report.name} secondary={`Статус: ${report.status}`} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained">Створити новий звіт</Button>
      </Paper>
    </Box>
  );
}
