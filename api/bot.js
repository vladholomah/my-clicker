// api/bot.js
const TelegramBot = require('7362436326:AAGYoUiT5HXdjpS5T78jMYgWn23Tqlti11c');
const { MongoClient } = require('mongodb');

// Ініціалізація бота
const bot = new TelegramBot(process.env.BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { message } = req.body;

    if (message && message.text.startsWith('/start')) {
      const referralCode = message.text.split(' ')[1];
      if (referralCode) {
        const client = new MongoClient(process.env.MONGODB_URI);
        try {
          await client.connect();
          const db = client.db('your_database_name');
          const users = db.collection('users');

          await users.updateOne(
            { telegramId: referralCode },
            { $addToSet: { referrals: message.from.id.toString() } },
            { upsert: true }
          );

          await bot.sendMessage(message.chat.id, 'Ви успішно приєдналися за реферальним посиланням!');
        } catch (error) {
          console.error('Error processing referral:', error);
          await bot.sendMessage(message.chat.id, 'Виникла помилка при обробці реферального посилання.');
        } finally {
          await client.close();
        }
      } else {
        await bot.sendMessage(message.chat.id, 'Вітаємо в боті!');
      }
    }

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};