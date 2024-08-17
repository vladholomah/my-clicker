import { WebAppInstance } from '@twa-dev/sdk';

declare global {
  interface Window {
    Telegram: {
      WebApp: WebAppInstance;
    };
  }
}

export {};