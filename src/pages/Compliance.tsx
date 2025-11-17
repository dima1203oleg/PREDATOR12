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
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const canReveal = role === 'pro' || role === 'admin';

  const handleToggle = async (name: string) => {
    if (!canReveal || pending[name]) return;

    const nextState = !revealed[name];
    setPending((prev) => ({ ...prev, [name]: true }));
    setError(null);

    try {
      const response = await fetch('/api/audit/pii-reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counterparty: name, action: nextState ? 'reveal' : 'hide' })
      });

      if (!response.ok) {
        throw new Error('pii_audit_failed');
      }

      const payload = (await response.json().catch(() => ({}))) as { allowed?: boolean };
      if (payload.allowed === false) {
        throw new Error('pii_reveal_denied');
      }

      setRevealed((prev) => ({ ...prev, [name]: nextState }));
    } catch (err) {
      setError(t('piiRevealDenied'));
    } finally {
      setPending((prev) => ({ ...prev, [name]: false }));
    }
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
              const isPending = pending[row.name];
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
                      disabled={!canReveal || isPending}
                      onClick={() => handleToggle(row.name)}
                      variant={canReveal && isRevealed ? 'outlined' : 'contained'}
                      aria-busy={isPending}
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
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      {canReveal && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {t('piiRevealAuditNotice')}
        </Typography>
      )}
    </Box>
  );
}
