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
          // Якщо дані користувача недоступні через Telegram WebApp, спробуємо отримати їх з URL
          const urlParams = new URLSearchParams(window.location.search);
          const userId = urlParams.get('userId');
          if (userId) {
            console.log('userId found in URL:', userId);
            setUser({ id: parseInt(userId) } as TelegramUser);
          } else {
            console.error('No userId found in URL');
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