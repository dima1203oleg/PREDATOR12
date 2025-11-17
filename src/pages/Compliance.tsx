import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

const rows = [
  { name: 'Company A', risk: 'Medium', masked: '****1234' },
  { name: 'Company B', risk: 'High', masked: '****5678' }
];

export function Compliance() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Комплаєнс та Ризики
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Контрагент</TableCell>
              <TableCell>PII</TableCell>
              <TableCell>Ризик</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.masked}</TableCell>
                <TableCell>{row.risk}</TableCell>
                <TableCell>
                  <Button size="small">Показати (Pro)</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
