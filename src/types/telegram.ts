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
  ready: () => void;
  initDataUnsafe: WebAppInitData;
  openTelegramLink: (url: string) => void;
}

export type TelegramWebApp = {
  WebApp: WebAppInstance;
};