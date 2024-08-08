import { useEffect, useState } from 'react';

interface TelegramUser {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
}

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
      setUser(tg.initDataUnsafe.user);
    }
  }, []);

  return { user };
};