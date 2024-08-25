import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { TelegramUser } from '../types/telegram';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    const initTelegram = () => {
      if (WebApp.initDataUnsafe.query_id) {
        if (WebApp.initDataUnsafe.user) {
          setUser(WebApp.initDataUnsafe.user);
          console.log('Telegram user data:', WebApp.initDataUnsafe.user);
        } else {
          console.warn('User data not available in Telegram WebApp');
        }
      } else {
        console.warn('Running outside of Telegram WebApp');
        // Можливо, тут ви захочете встановити якісь тестові дані користувача
        // setUser({ id: 12345, first_name: 'Test', username: 'testuser' });
      }
    };

    initTelegram();
  }, []);

  return {
    user,
    tg: WebApp,
    isInTelegram: !!WebApp.initDataUnsafe.query_id
  };
};