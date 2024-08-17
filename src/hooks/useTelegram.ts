import { useEffect, useState } from 'react';
import { TelegramUser, WebAppInstance } from '../types/telegram';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [tg, setTg] = useState<WebAppInstance | null>(null);

  useEffect(() => {
    const telegram = window.Telegram.WebApp;
    setTg(telegram);

    telegram.ready();
    setUser(telegram.initDataUnsafe.user || null);
  }, []);

  return { user, tg };
};