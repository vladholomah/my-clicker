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

const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

module.exports = async (req, res) => {
  console.log('Bot handler called');
  console.log('Webhook received:', JSON.stringify(req.body, null, 2));

  try {
    const db = await connectToDatabase();
    console.log('Database connected');
    const users = db.collection('users');

    if (req.body && req.body.message) {
      const { chat: { id: chatId }, text, from: { id: userId, first_name, last_name, username } } = req.body.message;
      console.log(`Received message: ${text} from user ${userId}`);

      if (text === '/start' || text.startsWith('/start')) {
        console.log(`Processing /start command for user ${userId}`);
        try {
          const referralCode = text.split(' ')[1] || generateReferralCode();
          let user = await users.findOne({ telegramId: userId.toString() });

          if (!user) {
            user = {
              telegramId: userId.toString(),
              coins: 0,
              referrals: [],
              firstName: first_name,
              lastName: last_name,
              username: username,
              referralCode: referralCode
            };
            await users.insertOne(user);
            console.log('New user created:', user);
          }

          if (referralCode && referralCode !== user.referralCode) {
            const referrer = await users.findOne({ referralCode: referralCode });
            if (referrer) {
              await users.updateOne(
                { telegramId: referrer.telegramId },
                { $addToSet: { referrals: userId.toString() } }
              );
              console.log(`User ${userId} added to referrals of ${referrer.telegramId}`);
            }
          }

          const keyboard = {
            keyboard: [
              [{ text: 'Play Now', web_app: { url: process.env.FRONTEND_URL } }],
              [{ text: 'Invite a friend' }]
            ],
            resize_keyboard: true
          };

          await sendTelegramMessage(chatId, `Welcome to Holmah Coin bot! Your referral code is: ${user.referralCode}. Choose an option:`, keyboard);
          console.log('Welcome message sent');
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
        console.log(`Received unknown command: ${text}`);
        await sendTelegramMessage(chatId, 'Sorry, I don\'t understand this command. Try /start');
      }
    } else {
      console.log('Received request without message');
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