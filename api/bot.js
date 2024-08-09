const TelegramBot = require('node-telegram-bot-api');
const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const connectToDatabase = async () => {
  if (!db) {
    const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db('holmah_coin_db');
    console.log('Connected to MongoDB');
  }
  return db;
};

module.exports = async (req, res) => {
  console.log('Отримано запит до бота');

  const bot = new TelegramBot(process.env.BOT_TOKEN);

  try {
    const db = await connectToDatabase();
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

          await users.updateOne(
            { telegramId: userId },
            { $setOnInsert: { telegramId: userId, coins: 0, referrals: [] } },
            { upsert: true }
          );

          if (referralCode && referralCode !== userId) {
            await users.updateOne(
              { telegramId: referralCode },
              { $addToSet: { referrals: userId } }
            );
            await bot.sendMessage(chatId, 'Ви приєдналися за реферальним посиланням!');
          }

          const keyboard = {
            keyboard: [
              [{ text: 'Play Now', web_app: { url: 'https://my-clicker-tau.vercel.app/' } }],
              [{ text: 'Запросити друга' }]
            ],
            resize_keyboard: true
          };

          await bot.sendMessage(chatId, 'Вітаємо в Holmah Coin боті! Оберіть опцію:', {
            reply_markup: JSON.stringify(keyboard)
          });
        } else if (text === 'Запросити друга') {
          const referralLink = `https://t.me/holmah_coin_bot?start=${userId}`;
          const inviteText = `Приєднуйся до Holmah Coin! Ось моє реферальне посилання: ${referralLink}`;

          await bot.sendMessage(chatId, 'Ось ваше реферальне посилання. Натисніть кнопку нижче, щоб поділитися ним:', {
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Поділитися посиланням', switch_inline_query: inviteText }]
              ]
            }
          });
        }
      }
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Помилка:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};