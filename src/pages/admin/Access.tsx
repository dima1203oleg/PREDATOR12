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
import { useTranslation } from 'react-i18next';

const users = [
  { name: 'Oksana', role: 'pro' },
  { name: 'Taras', role: 'client' }
];

export function Access() {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('accessTitle')}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('accessUser')}</TableCell>
              <TableCell>{t('accessRole')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.name}>
                <TableCell>{user.name}</TableCell>
                <TableCell>
                  <Select size="small" value={user.role}>
                    <MenuItem value="client">{t('accessRoleClient')}</MenuItem>
                    <MenuItem value="pro">{t('accessRolePro')}</MenuItem>
                    <MenuItem value="admin">{t('accessRoleAdmin')}</MenuItem>
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
