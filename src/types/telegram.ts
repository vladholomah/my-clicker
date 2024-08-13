export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface WebAppInitData {
  user?: TelegramUser;
}

export interface WebAppInstance {
  initDataUnsafe: WebAppInitData;
  openTelegramLink: (url: string) => void;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: WebAppInstance;
    };
  }
}