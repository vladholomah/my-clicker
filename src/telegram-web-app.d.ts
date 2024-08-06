interface TelegramWebApp {
  setHeaderColor: (color: string) => void;
  setThemeParams: (params: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  }) => void;
  // Додайте інші методи Telegram Web App API, які ви можете використовувати
}

interface Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}