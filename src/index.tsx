import React, { useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import WebApp from '@twa-dev/sdk';

const TelegramWebAppWrapper: React.FC = () => {
  useEffect(() => {
    console.log('TelegramWebAppWrapper mounted');
    console.log('WebApp object:', WebApp);
    console.log('WebApp.initData:', WebApp.initData);
    console.log('WebApp.initDataUnsafe:', WebApp.initDataUnsafe);
    console.log('Is in Telegram:', WebApp.initDataUnsafe.query_id ? 'Yes' : 'No');

    if (WebApp.initDataUnsafe.query_id) {
      console.log('Running inside Telegram WebApp');
      WebApp.ready();
      WebApp.expand();
      WebApp.setHeaderColor('#000000');

      // Встановлення теми
      document.documentElement.style.setProperty('--tg-theme-bg-color', WebApp.themeParams.bg_color);
      document.documentElement.style.setProperty('--tg-theme-text-color', WebApp.themeParams.text_color);
      document.documentElement.style.setProperty('--tg-theme-button-color', WebApp.themeParams.button_color);
      document.documentElement.style.setProperty('--tg-theme-button-text-color', WebApp.themeParams.button_text_color);

      console.log('WebApp theme params:', WebApp.themeParams);
      console.log('WebApp user:', WebApp.initDataUnsafe.user);
      console.log('WebApp start_param:', WebApp.initDataUnsafe.start_param);
    } else {
      console.log('Running outside of Telegram WebApp');
      // Встановіть деякі значення за замовчуванням для браузерної версії
      document.documentElement.style.setProperty('--tg-theme-bg-color', '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-text-color', '#000000');
      document.documentElement.style.setProperty('--tg-theme-button-color', '#3390ec');
      document.documentElement.style.setProperty('--tg-theme-button-text-color', '#ffffff');
    }
  }, []);

  return <App />;
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <TelegramWebAppWrapper />
  </React.StrictMode>
);

// Додаткове логування глобальних об'єктів
console.log('Window object:', window);
console.log('Window.Telegram:', (window as any).Telegram);

reportWebVitals();