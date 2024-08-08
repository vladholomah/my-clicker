const TelegramBot = require('node-telegram-bot-api');
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  console.log('Отримано запит до бота');

  const bot = new TelegramBot(process.env.BOT_TOKEN);
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('holmah_coin_db');
    const users = db.collection('users');

    if (req.method === 'POST') {
      const { body } = req;
      console.log('Тіло запиту:', JSON.stringify(body));

      if (body.message && body.message.text) {
        const chatId = body.message.chat.id;
        const text = body.message.text;
        const userId = body.message.from.id.toString();

        console.log('Отримано повідомлення:', text);

        if (text.startsWith('/start')) {
          const referralCode = text.split(' ')[1];

          // Зберігаємо або оновлюємо користувача
          await users.updateOne(
            { telegramId: userId },
            { $setOnInsert: { telegramId: userId, coins: 0, referrals: [] } },
            { upsert: true }
          );

          if (referralCode && referralCode !== userId) {
            // Обробка реферального коду
            await users.updateOne(
              { telegramId: referralCode },
              { $addToSet: { referrals: userId } }
            );
            await bot.sendMessage(chatId, 'Ви приєдналися за реферальним посиланням!');
          }

          const keyboard = {
            inline_keyboard: [
              [{ text: 'Play Now', web_app: { url: 'https://your-vercel-app-url.vercel.app' } }],
              [{ text: 'Запросити друзів', callback_data: 'invite_friends' }]
            ]
          };

          await bot.sendMessage(chatId, 'Вітаємо в Holmah Coin боті! Оберіть опцію:', {
            reply_markup: JSON.stringify(keyboard)
          });
        }
      } else if (body.callback_query) {
        const chatId = body.callback_query.message.chat.id;
        const userId = body.callback_query.from.id.toString();

        if (body.callback_query.data === 'invite_friends') {
          const referralLink = `https://t.me/your_bot_username?start=${userId}`;
          await bot.sendMessage(chatId, `Ось ваше реферальне посилання: ${referralLink}`);
        }
      }
    }
  } catch (error) {
    console.error('Помилка:', error);
  } finally {
    await client.close();
  }

  res.status(200).json({ ok: true });
};