import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import WebApp from '@twa-dev/sdk';

const TelegramWebAppWrapper: React.FC = () => {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();

    // Встановлення кольору шапки та фону
    WebApp.MainButton.setParams({
      text: "Play Now",
      color: '#2cab37',
    });

    // Встановлення теми
    document.documentElement.style.setProperty('--tg-theme-bg-color', WebApp.themeParams.bg_color);
    document.documentElement.style.setProperty('--tg-theme-text-color', WebApp.themeParams.text_color);
    document.documentElement.style.setProperty('--tg-theme-button-color', WebApp.themeParams.button_color);
    document.documentElement.style.setProperty('--tg-theme-button-text-color', WebApp.themeParams.button_text_color);

    console.log('WebApp theme params:', WebApp.themeParams);
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

reportWebVitals();