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
        const keyboard = {
          inline_keyboard: [
            [{ text: 'Play Now', web_app: { url: 'https://my-clicker-tau.vercel.app/' } }]
          ]
        };

        await bot.sendMessage(chatId, 'Вітаємо в Holmah Coin боті! Натисніть кнопку нижче, щоб почати гру:', {
          reply_markup: JSON.stringify(keyboard)
        });
        console.log('Відправлено відповідь на команду /start з кнопкою Play Now');
      }
    }
  }

  res.status(200).json({ ok: true });
};