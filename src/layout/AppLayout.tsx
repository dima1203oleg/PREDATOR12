import { useMemo, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import Menu from '@mui/material/Menu';
import MenuItemM from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ScienceIcon from '@mui/icons-material/Science';
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import MonitorIcon from '@mui/icons-material/Monitor';
import MapIcon from '@mui/icons-material/Map';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthStore } from '../state/authStore';
import { buildTheme } from '../theme';
import { ThemeProvider, CssBaseline } from '@mui/material';

const drawerWidth = 280;

export function AppLayout() {
  const { t, i18n } = useTranslation();
  const role = useAuthStore((state) => state.role);
  const username = useAuthStore((state) => state.username);
  const setRole = useAuthStore((state) => state.setRole);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const theme = useMemo(() => buildTheme(themeMode), [themeMode]);

  const navItems = [
    { to: '/_app/feed', icon: <HomeIcon />, label: t('feed'), roles: ['client', 'pro', 'admin'] },
    { to: '/_app/chat', icon: <ChatIcon />, label: t('chat'), roles: ['client', 'pro', 'admin'] },
    { to: '/_app/data-sources', icon: <CloudUploadIcon />, label: t('dataSources'), roles: ['client', 'pro', 'admin'] },
    { to: '/_app/analytics/what-if', icon: <ScienceIcon />, label: t('analytics'), roles: ['client', 'pro', 'admin'] },
    { to: '/_app/compliance', icon: <GavelIcon />, label: t('compliance'), roles: ['client', 'pro', 'admin'] },
    { to: '/_app/reports', icon: <DescriptionIcon />, label: t('reports'), roles: ['client', 'pro', 'admin'] },
    { to: '/_app/settings', icon: <SettingsIcon />, label: t('settings'), roles: ['client', 'pro', 'admin'] },
    { to: '/_app/admin/monitoring', icon: <MonitorIcon />, label: t('monitoring'), roles: ['pro', 'admin'] },
    { to: '/_app/admin/agents-map', icon: <MapIcon />, label: t('agentsMap'), roles: ['pro', 'admin'] },
    { to: '/_app/admin/deep-analytics', icon: <SearchIcon />, label: t('deepAnalytics'), roles: ['pro', 'admin'] },
    { to: '/_app/admin/access', icon: <SecurityIcon />, label: t('access'), roles: ['admin'] }
  ];

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleProfileMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleThemeToggle = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const drawer = (
    <div>
      <Toolbar sx={{ minHeight: 72 }}>
        <Typography variant="h6" noWrap>
          {t('brand')}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => (
            <ListItem key={item.to} disablePadding>
              <ListItemButton component={NavLink} to={item.to} onClick={() => setMobileOpen(false)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {t('brand')}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Select
                size="small"
                value={i18n.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                sx={{ color: 'inherit', '& .MuiSelect-icon': { color: 'inherit' } }}
              >
                <MenuItem value="ua">UA</MenuItem>
                <MenuItem value="en">EN</MenuItem>
              </Select>
              <Tooltip title={`${t('theme')}: ${themeMode === 'light' ? t('light') : t('dark')}`}>
                <Switch checked={themeMode === 'dark'} onChange={handleThemeToggle} />
              </Tooltip>
              <Button color="inherit" onClick={() => navigate('/billing')}>
                {t('billing')}
              </Button>
              <IconButton color="inherit" onClick={handleProfileMenu}>
                <Avatar sx={{ width: 32, height: 32 }}>{username?.[0]}</Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItemM onClick={() => handleClose()}>{username}</MenuItemM>
                <MenuItemM
                  onClick={() => {
                    setRole('guest');
                    setAnchorEl(null);
                    navigate('/auth/login');
                  }}
                >
                  {t('logout')}
                </MenuItemM>
              </Menu>
            </Stack>
          </Toolbar>
        </AppBar>
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { width: drawerWidth }
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
          <Toolbar />
          <Container maxWidth="xl">
            <Outlet />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
