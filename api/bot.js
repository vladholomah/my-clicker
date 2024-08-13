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

module.exports = async (req, res) => {
  console.log('Отримано запит до бота');

  try {
    const db = await connectToDatabase();
    console.log('База даних підключена');
    const users = db.collection('users');
    const bot = initBot();

    if (req.method === 'POST') {
      const { body } = req;
      console.log('Отримано POST запит:', JSON.stringify(body));
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

            await bot.sendMessage(chatId, 'Вітаємо в Holmah Coin боті! Оберіть опцію:', {
              reply_markup: JSON.stringify(keyboard)
            });
          } catch (error) {
            console.error('Помилка при реєстрації користувача:', error);
            await bot.sendMessage(chatId, 'Виникла помилка при реєстрації. Спробуйте пізніше.');
          }
        }
      }
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Загальна помилка:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};