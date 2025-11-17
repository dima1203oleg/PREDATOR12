import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      brand: 'Predator Analytics',
      welcome: 'Welcome back',
      feed: 'My Daily Feed',
      chat: 'Chat Analyst',
      dataSources: 'Data Sources',
      analytics: 'Analytics',
      compliance: 'Compliance & Risk',
      reports: 'Reports',
      settings: 'Settings',
      monitoring: 'Monitoring',
      agentsMap: 'Map of Agents',
      deepAnalytics: 'Deep Analytics',
      access: 'Access Control',
      billing: 'Billing',
      login: 'Login',
      logout: 'Logout',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark'
    }
  },
  ua: {
    translation: {
      brand: 'Predator Analytics',
      welcome: 'З поверненням',
      feed: 'Мій щоденний огляд',
      chat: 'Чат Аналітик',
      dataSources: 'Джерела Даних',
      analytics: 'Аналітичні Модулі',
      compliance: 'Комплаєнс та Ризики',
      reports: 'Звіти',
      settings: 'Налаштування',
      monitoring: 'Моніторинг',
      agentsMap: 'Мапа Агентів',
      deepAnalytics: 'Глибинна Аналітика',
      access: 'Керування Доступом',
      billing: 'Білінг',
      login: 'Увійти',
      logout: 'Вийти',
      language: 'Мова',
      theme: 'Тема',
      light: 'Світла',
      dark: 'Темна'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ua',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
