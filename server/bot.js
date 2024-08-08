// bot.js
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Замініть на ваш токен
const token = '7362436326:AAGYoUiT5HXdjpS5T78jMYgWn23Tqlti11c';
const bot = new TelegramBot(token, {polling: true});

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
      bot.sendMessage(chatId, 'Вітаємо! Ви успішно приєдналися за реферальним посиланням.');
    } else {
      bot.sendMessage(chatId, 'Виникла помилка при обробці реферального посилання.');
    }
  } catch (error) {
    console.error('Error processing referral:', error);
    bot.sendMessage(chatId, 'Виникла помилка при обробці реферального посилання.');
  }
});

console.log('Bot is running...');