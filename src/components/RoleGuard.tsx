import { ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import { useAuthStore, UserRole } from '../state/authStore';

interface RoleGuardProps {
  allow: UserRole[];
  children: ReactNode;
}

export function RoleGuard({ allow, children }: RoleGuardProps) {
  const role = useAuthStore((state) => state.role);
  if (!allow.includes(role)) {
    return <Typography color="text.secondary">Access restricted for your role.</Typography>;
  }
  return <>{children}</>;
}
