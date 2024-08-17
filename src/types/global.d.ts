import { TelegramWebApp } from './telegram';

declare global {
  interface Window {
    Telegram: TelegramWebApp;
  }
}

export {};