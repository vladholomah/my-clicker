import { useEffect, useState } from 'react';
import { TelegramUser, WebAppInstance } from '../types/telegram';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [tg, setTg] = useState<WebAppInstance | null>(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const telegram = window.Telegram.WebApp;
      setTg(telegram);

      telegram.ready();

      if (telegram.initDataUnsafe && telegram.initDataUnsafe.user) {
        setUser(telegram.initDataUnsafe.user);
      } else {
        console.warn('User data not available in Telegram WebApp');
      }
    } else {
      console.error('Telegram WebApp is not available');
    }
  }, []);

  return { user, tg };
};