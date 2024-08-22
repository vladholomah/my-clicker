import { useEffect, useState } from 'react';
import { TelegramUser, WebAppInstance } from '../types/telegram';
import WebApp from '@twa-dev/sdk';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [tg, setTg] = useState<WebAppInstance | null>(null);

  useEffect(() => {
    if (WebApp.initDataUnsafe.query_id) {
      setTg(WebApp);

      if (WebApp.initDataUnsafe.user) {
        setUser(WebApp.initDataUnsafe.user);
      } else {
        console.warn('User data not available in Telegram WebApp');
      }

      console.log('WebApp initialized:', WebApp.initDataUnsafe);
    } else {
      console.warn('Running outside of Telegram WebApp');
      // Тестові дані для розробки
      setUser({
        id: 12345,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser'
      });

      // Створюємо заглушку для tg об'єкта
      setTg({
        openTelegramLink: (url: string) => {
          console.log('Opening Telegram link:', url);
          window.open(url, '_blank');
        },
        // Додайте інші необхідні методи тут
      } as WebAppInstance);
    }
  }, []);

  return { user, tg };
};