import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../state/authStore';

const rows = [
  { name: 'Company A', risk: 'Medium', pii: 'UA1234567890', masked: 'UA****7890' },
  { name: 'Company B', risk: 'High', pii: 'US987654321', masked: 'US***4321' }
];

export function Compliance() {
  const { t } = useTranslation();
  const role = useAuthStore((state) => state.role);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const canReveal = role === 'pro' || role === 'admin';

  const handleToggle = (name: string) => {
    if (!canReveal) return;
    setRevealed((prev) => ({ ...prev, [name]: !prev[name] }));
    console.info('PII visibility toggled', { name });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('complianceTitle')}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('counterparty')}</TableCell>
              <TableCell>{t('pii')}</TableCell>
              <TableCell>{t('risk')}</TableCell>
              <TableCell>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isRevealed = revealed[row.name];
              return (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={canReveal && isRevealed ? row.pii : row.masked}
                        color={canReveal && isRevealed ? 'warning' : 'default'}
                        size="small"
                      />
                      {!canReveal && (
                        <Typography variant="caption" color="text.secondary">
                          {t('piiMasked')}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>{row.risk}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      disabled={!canReveal}
                      onClick={() => handleToggle(row.name)}
                      variant={canReveal && isRevealed ? 'outlined' : 'contained'}
                    >
                      {canReveal && isRevealed ? t('hide') : t('reveal')}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
