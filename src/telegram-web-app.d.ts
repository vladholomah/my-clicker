interface TelegramWebApp {
  // Методи для налаштування зовнішнього вигляду
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setThemeParams: (params: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  }) => void;

  // Методи життєвого циклу
  ready: () => void;
  expand: () => void;
  close: () => void;

  // Методи для отримання інформації
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    start_param?: string;
  };
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;

  // Методи для взаємодії
  sendData: (data: string) => void;
  openLink: (url: string) => void;
  openTelegramLink: (url: string) => void;

  // Методи для роботи з основною кнопкою
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    setParams: (params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }) => void;
  };

  // Методи для роботи з кнопкою "Назад"
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };

  // Методи для роботи з haptic feedback
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };

  // Методи для роботи з темою
  onEvent: (eventType: 'themeChanged' | 'viewportChanged' | 'mainButtonClicked', eventHandler: () => void) => void;
  offEvent: (eventType: 'themeChanged' | 'viewportChanged' | 'mainButtonClicked', eventHandler: () => void) => void;
}

interface Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}