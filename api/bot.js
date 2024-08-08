const TelegramBot = require('node-telegram-bot-api');

module.exports = async (req, res) => {
  const bot = new TelegramBot(process.env.BOT_TOKEN);

  if (req.method === 'POST') {
    const { body } = req;

    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text;

      console.log('Received message:', text);  // Додаємо логування

      if (text.startsWith('/start')) {
        const referralCode = text.split(' ')[1];
        if (referralCode) {
          await bot.sendMessage(chatId, `Ви приєдналися за реферальним кодом: ${referralCode}`);
        } else {
          await bot.sendMessage(chatId, 'Вітаємо в Holmah Coin боті! Використовуйте кнопку "Запросити друга" для отримання реферального посилання.');
        }
      }
    }
  }

  res.status(200).json({ ok: true });
};