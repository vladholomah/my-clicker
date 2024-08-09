const TelegramBot = require('node-telegram-bot-api');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const referralCode = match[1];

  const db = client.db('holmah_coin_db');
  const users = db.collection('users');

  await users.updateOne(
    { telegramId: userId },
    { $setOnInsert: { telegramId: userId, referrals: [] } },
    { upsert: true }
  );

  if (referralCode && referralCode !== userId) {
    await users.updateOne(
      { telegramId: referralCode },
      { $addToSet: { referrals: userId } }
    );
    bot.sendMessage(chatId, 'Ви приєдналися за реферальним посиланням!');
  }

  bot.sendMessage(chatId, 'Ласкаво просимо! Натисніть кнопку нижче, щоб почати грати.', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Play Now', web_app: { url: 'https://your-web-app-url.com' } }]
      ]
    }
  });
});

console.log('Bot is running...');