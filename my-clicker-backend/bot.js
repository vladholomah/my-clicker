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
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const result = await response.json();
    console.log('Telegram API response:', JSON.stringify(result));
    return result;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw error;
  }
};

module.exports = async (req, res) => {
  console.log('Webhook received:', JSON.stringify(req.body, null, 2));
  console.log('Request method:', req.method);
  console.log('Request headers:', JSON.stringify(req.headers));

  try {
    const db = await connectToDatabase();
    console.log('Database connected');
    const users = db.collection('users');

    if (req.method === 'POST') {
      const { body } = req;
      if (body.message && body.message.text) {
        const { chat: { id: chatId }, text, from: { id: userId } } = body.message;
        console.log(`Received message: ${text} from user ${userId}`);

        if (text.startsWith('/start')) {
          console.log(`Processing /start command for user ${userId}`);
          try {
            const result = await users.updateOne(
              { telegramId: userId.toString() },
              { $setOnInsert: { telegramId: userId.toString(), coins: 0, referrals: [] } },
              { upsert: true }
            );
            console.log('User update result:', JSON.stringify(result));

            const keyboard = {
              keyboard: [
                [{ text: 'Play Now', web_app: { url: process.env.FRONTEND_URL } }],
                [{ text: 'Invite a friend' }]
              ],
              resize_keyboard: true
            };

            await sendTelegramMessage(chatId, 'Welcome to Holmah Coin bot! Choose an option:', keyboard);
            console.log('Welcome message sent');
          } catch (error) {
            console.error('Error processing /start command:', error);
            await sendTelegramMessage(chatId, 'An error occurred during registration. Please try again later.');
          }
        } else {
          console.log(`Received unknown command: ${text}`);
          await sendTelegramMessage(chatId, 'Sorry, I don\'t understand this command. Try /start');
        }
      } else {
        console.log('Received request without text message');
      }
    } else {
      console.log(`Received ${req.method} request`);
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('General error:', error);
    console.error('Error stack:', error.stack);
    res.status(200).json({ ok: true }); // Always respond with 200 OK for Telegram
  } finally {
    console.log('Request processing completed');
  }
};