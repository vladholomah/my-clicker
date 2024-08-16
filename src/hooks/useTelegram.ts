import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface TelegramWebApp {
  ready: () => void;
  initDataUnsafe: {
    user?: TelegramUser;
  };
  openTelegramLink: (url: string) => void;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [tg, setTg] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    const telegram = window.Telegram.WebApp;
    setTg(telegram);

    telegram.ready();
    setUser(telegram.initDataUnsafe.user || null);
  }, []);

  return { user, tg };
};