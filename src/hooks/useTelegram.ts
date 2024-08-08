interface TelegramUser {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface WebAppInitData {
  user?: TelegramUser;
}

interface WebAppInstance {
  initDataUnsafe: WebAppInitData;
  // Додайте інші методи та властивості, які ви використовуєте
}

declare global {
  interface Window {
    Telegram: {
      WebApp: WebAppInstance;
    };
  }
}

import { useEffect, useState } from 'react';

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