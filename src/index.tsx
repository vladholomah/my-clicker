import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

declare global {
  interface Window {
    Telegram: any;
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const TelegramWebAppWrapper: React.FC = () => {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#000000');
    tg.setBackgroundColor('#000000');
  }, []);

  return <App />;
};

root.render(
  <React.StrictMode>
    <TelegramWebAppWrapper />
  </React.StrictMode>
);

reportWebVitals();