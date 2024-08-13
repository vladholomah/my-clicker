const { MongoClient } = require('mongodb');
const fetch = require('node-fetch');

let db;

const connectToDatabase = async () => {
  if (!db) {
    try {
      const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
      db = client.db('holmah_coin_db');
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }
  return db;
};

const sendTelegramMessage = async (chatId, text, keyboard = null) => {
  const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;
  const body = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  };
  if (keyboard) {
    body.reply_markup = JSON.stringify(keyboard);
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return response.json();
};

module.exports = async (req, res) => {
  console.log('Отримано запит до бота');
  console.log('Метод запиту:', req.method);
  console.log('Заголовки запиту:', JSON.stringify(req.headers));
  console.log('Тіло запиту:', JSON.stringify(req.body));

  try {
    const db = await connectToDatabase();
    console.log('База даних підключена');
    const users = db.collection('users');

    if (req.method === 'POST') {
      const { body } = req;
      if (body.message && body.message.text) {
        const { chat: { id: chatId }, text, from: { id: userId } } = body.message;

        if (text.startsWith('/start')) {
          console.log(`Обробка команди /start для користувача ${userId}`);
          try {
            const result = await users.updateOne(
              { telegramId: userId.toString() },
              { $setOnInsert: { telegramId: userId.toString(), coins: 0, referrals: [] } },
              { upsert: true }
            );
            console.log('Результат оновлення користувача:', JSON.stringify(result));

            const keyboard = {
              keyboard: [
                [{ text: 'Play Now', web_app: { url: 'https://my-clicker-tau.vercel.app/' } }],
                [{ text: 'Запросити друга' }]
              ],
              resize_keyboard: true
            };

            await sendTelegramMessage(chatId, 'Вітаємо в Holmah Coin боті! Оберіть опцію:', keyboard);
          } catch (error) {
            console.error('Помилка при реєстрації користувача:', error);
            await sendTelegramMessage(chatId, 'Виникла помилка при реєстрації. Спробуйте пізніше.');
          }
        }
      }
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Загальна помилка:', error);
    res.status(200).json({ ok: true }); // Завжди відповідаємо 200 OK для Telegram
  }
};