import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const users = [
  { name: 'Oksana', role: 'pro' },
  { name: 'Taras', role: 'client' }
];

export function Access() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Керування доступом
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Користувач</TableCell>
              <TableCell>Роль</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.name}>
                <TableCell>{user.name}</TableCell>
                <TableCell>
                  <Select size="small" value={user.role}>
                    <MenuItem value="client">Client</MenuItem>
                    <MenuItem value="pro">Pro</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
