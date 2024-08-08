const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '7362436326:AAGYoUiT5HXdjpS5T78jMYgWn23Tqlti11c';
const bot = new TelegramBot(token, {polling: true});

// Обробка команди /start без параметрів
bot.onText(/\/start$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Вітаємо в Holmah Coin! Використовуйте своє реферальне посилання, щоб запросити друзів.');
});

// Обробка команди /start з параметром (реферальне посилання)
bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const referrerId = match[1]; // ID користувача, який запросив
  const newUserId = msg.from.id.toString(); // ID нового користувача

  try {
    // Виклик API для обробки реферала
    const response = await axios.post('http://localhost:3001/api/referral', {
      referrerId,
      newUserId
    });

    if (response.data.success) {
      bot.sendMessage(chatId, 'Вітаємо! Ви успішно приєдналися за реферальним посиланням до Holmah Coin.');
    } else {
      bot.sendMessage(chatId, 'Виникла помилка при обробці реферального посилання.');
    }
  } catch (error) {
    console.error('Error processing referral:', error);
    bot.sendMessage(chatId, 'Виникла помилка при обробці реферального посилання.');
  }
});

console.log('Holmah Coin Bot is running...');