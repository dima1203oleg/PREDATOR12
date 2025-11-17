import { createTheme } from '@mui/material/styles';

export const buildTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1f4b99' : '#90caf9'
      },
      background: {
        default: mode === 'light' ? '#f4f6fb' : '#0b121a',
        paper: mode === 'light' ? '#ffffff' : '#111827'
      }
    },
    typography: {
      fontFamily: 'Inter, Roboto, system-ui, sans-serif'
    }
  });
