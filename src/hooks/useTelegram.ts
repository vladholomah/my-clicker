import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { TelegramUser } from '../types/telegram';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isInTelegram, setIsInTelegram] = useState<boolean>(false);

  useEffect(() => {
    const initTelegram = () => {
      console.log('Initializing Telegram hook');
      console.log('WebApp.initDataUnsafe:', WebApp.initDataUnsafe);

      if (WebApp.initDataUnsafe.query_id) {
        setIsInTelegram(true);
        if (WebApp.initDataUnsafe.user) {
          setUser(WebApp.initDataUnsafe.user);
          console.log('Telegram user data:', WebApp.initDataUnsafe.user);
        } else {
          console.warn('User data not available in Telegram WebApp');
        }
      } else {
        console.warn('Running outside of Telegram WebApp');
        setIsInTelegram(false);
        // Можливо, тут ви захочете встановити якісь тестові дані користувача
        // setUser({ id: 12345, first_name: 'Test', username: 'testuser' });
      }
    };

    initTelegram();
  }, []);

  return {
    user,
    tg: WebApp,
    isInTelegram
  };
};