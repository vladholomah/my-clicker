import { useEffect, useState } from 'react';
import { TelegramUser, WebAppInstance } from '../types/telegram';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [tg, setTg] = useState<WebAppInstance | null>(null);

  useEffect(() => {
    const initTelegram = () => {
      console.log('Initializing Telegram WebApp');
      if (window.Telegram && window.Telegram.WebApp) {
        const telegram = window.Telegram.WebApp;
        setTg(telegram);

        telegram.ready();

        if (telegram.initDataUnsafe && telegram.initDataUnsafe.user) {
          console.log('Telegram user data available:', telegram.initDataUnsafe.user);
          setUser(telegram.initDataUnsafe.user);
        } else {
          console.warn('User data not available in Telegram WebApp');
          // Спробуємо отримати userId з URL або localStorage
          const urlParams = new URLSearchParams(window.location.search);
          const userId = urlParams.get('userId') || localStorage.getItem('userId');
          if (userId) {
            console.log('userId found:', userId);
            setUser({ id: parseInt(userId) } as TelegramUser);
          } else {
            console.error('No userId found');
          }
        }
      } else {
        console.error('Telegram WebApp is not available');
      }
    };

    initTelegram();
  }, []);

  return { user, tg };
};