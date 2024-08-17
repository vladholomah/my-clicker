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
    return result;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw error;
  }
};

const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

module.exports = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const users = db.collection('users');

    if (req.body && req.body.message) {
      const { chat: { id: chatId }, text, from: { id: userId, first_name, last_name, username } } = req.body.message;

      if (text === '/start') {
        try {
          const referralCode = generateReferralCode();
          const result = await users.updateOne(
            { telegramId: userId.toString() },
            {
              $setOnInsert: {
                telegramId: userId.toString(),
                coins: 0,
                referrals: [],
                firstName: first_name,
                lastName: last_name,
                username: username,
                referralCode: referralCode
              }
            },
            { upsert: true }
          );

          const keyboard = {
            keyboard: [
              [{ text: 'Play Now', web_app: { url: process.env.FRONTEND_URL } }],
              [{ text: 'Invite a friend' }]
            ],
            resize_keyboard: true
          };

          await sendTelegramMessage(chatId, `Welcome to Holmah Coin bot! Your referral code is: ${referralCode}. Choose an option:`, keyboard);
        } catch (error) {
          console.error('Error processing /start command:', error);
          await sendTelegramMessage(chatId, 'An error occurred during registration. Please try again later.');
        }
      } else if (text === 'Invite a friend') {
        const user = await users.findOne({ telegramId: userId.toString() });
        if (user && user.referralCode) {
          const referralLink = `https://t.me/${process.env.BOT_USERNAME}?start=${user.referralCode}`;
          await sendTelegramMessage(chatId, `Share this link with your friends: ${referralLink}`);
        } else {
          await sendTelegramMessage(chatId, 'Sorry, we couldn\'t find your referral code. Please try /start command again.');
        }
      } else {
        await sendTelegramMessage(chatId, 'Sorry, I don\'t understand this command. Try /start');
      }
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('General error:', error);
    res.status(200).json({ ok: true }); // Always respond with 200 OK for Telegram
  }
};