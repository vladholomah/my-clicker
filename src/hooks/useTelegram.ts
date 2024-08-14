import { useState, useEffect } from 'react';
import { TelegramUser } from '../types/telegram';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    } else {
      console.warn('Telegram WebApp data is not available');
    }
  }, []);

  return { user };
};