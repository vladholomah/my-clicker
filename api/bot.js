const TelegramBot = require('node-telegram-bot-api');

module.exports = async (req, res) => {
  console.log('Отримано запит до бота');

  const bot = new TelegramBot(process.env.BOT_TOKEN);

  if (req.method === 'POST') {
    const { body } = req;
    console.log('Тіло запиту:', JSON.stringify(body));

    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text;

      console.log('Отримано повідомлення:', text);

      if (text.startsWith('/start')) {
        await bot.sendMessage(chatId, 'Вітаємо в Holmah Coin боті!');
        console.log('Відправлено відповідь на команду /start');
      }
    }
  }

  res.status(200).json({ ok: true });
};