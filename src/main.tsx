import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './i18n';
import { AppLayout } from './layout/AppLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Billing } from './pages/Billing';
import { Feed } from './pages/Feed';
import { Chat } from './pages/Chat';
import { DataSources } from './pages/DataSources';
import { AnalyticsWhatIf } from './pages/analytics/AnalyticsWhatIf';
import { CorruptionMap } from './pages/analytics/CorruptionMap';
import { Forecast } from './pages/analytics/Forecast';
import { GeoGlobe } from './pages/analytics/GeoGlobe';
import { Compliance } from './pages/Compliance';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Monitoring } from './pages/admin/Monitoring';
import { AgentsMap } from './pages/admin/AgentsMap';
import { DeepAnalytics } from './pages/admin/DeepAnalytics';
import { Access } from './pages/admin/Access';
import { RoleGuard } from './components/RoleGuard';
import { useAuthStore } from './state/authStore';
import { CssBaseline } from '@mui/material';
import { registerServiceWorker } from './serviceWorker';

const Root = () => {
  const role = useAuthStore((state) => state.role);

  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/billing" element={<Billing />} />
        <Route
          path="/_app"
          element={role === 'guest' ? <Navigate to="/auth/login" replace /> : <AppLayout />}
        >
          <Route path="feed" element={<Feed />} />
          <Route path="chat" element={<Chat />} />
          <Route path="data-sources" element={<DataSources />} />
          <Route path="analytics/what-if" element={<AnalyticsWhatIf />} />
          <Route path="analytics/corruption-map" element={<CorruptionMap />} />
          <Route path="analytics/forecast" element={<Forecast />} />
          <Route path="analytics/geoglobe" element={<GeoGlobe />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route
            path="admin/monitoring"
            element={
              <RoleGuard allow={['pro', 'admin']}>
                <Monitoring />
              </RoleGuard>
            }
          />
          <Route
            path="admin/agents-map"
            element={
              <RoleGuard allow={['pro', 'admin']}>
                <AgentsMap />
              </RoleGuard>
            }
          />
          <Route
            path="admin/deep-analytics"
            element={
              <RoleGuard allow={['pro', 'admin']}>
                <DeepAnalytics />
              </RoleGuard>
            }
          />
          <Route
            path="admin/access"
            element={
              <RoleGuard allow={['admin']}>
                <Access />
              </RoleGuard>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
