const { MongoClient } = require('mongodb');
const TelegramBot = require('node-telegram-bot-api');

let db;
let bot;

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

const initBot = () => {
  if (!bot) {
    bot = new TelegramBot(process.env.BOT_TOKEN);
  }
  return bot;
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
    const bot = initBot();

    if (req.body && req.body.message) {
      const { chat: { id: chatId }, text, from: { id: userId, first_name, last_name, username } } = req.body.message;
      console.log(`Received message: ${text} from user ${userId}`);

      if (text === '/start' || text.startsWith('/start')) {
        console.log(`Processing /start command for user ${userId}`);
        try {
          const referralCode = text.split(' ')[1];
          console.log(`Referral code from command: ${referralCode}`);
          let user = await users.findOne({ telegramId: userId.toString() });

          if (!user) {
            const newReferralCode = generateReferralCode();
            user = {
              telegramId: userId.toString(),
              coins: 0,
              referrals: [],
              firstName: first_name,
              lastName: last_name,
              username: username,
              referralCode: newReferralCode
            };
            await users.insertOne(user);
            console.log('New user created:', user);
          }

          if (referralCode && referralCode !== user.referralCode) {
            const referrer = await users.findOne({ referralCode: referralCode });
            if (referrer) {
              console.log(`Found referrer: ${referrer.telegramId}`);
              const updateResult = await users.updateOne(
                { telegramId: referrer.telegramId },
                { $addToSet: { referrals: userId.toString() } }
              );
              console.log(`Update result for referrer:`, updateResult);

              // Оновлюємо користувача, щоб показати, що він був запрошений
              await users.updateOne(
                { telegramId: userId.toString() },
                { $set: { invitedBy: referrer.telegramId } }
              );
              console.log(`User ${userId} added to referrals of ${referrer.telegramId}`);
            } else {
              console.log(`No referrer found for code: ${referralCode}`);
            }
          }

          const keyboard = {
            keyboard: [
              [{ text: 'Play Now', web_app: { url: process.env.FRONTEND_URL } }],
              [{ text: 'Invite a friend' }]
            ],
            resize_keyboard: true
          };

          await bot.sendMessage(chatId, `Welcome to Holmah Coin bot! Your referral code is: ${user.referralCode}. Choose an option:`, { reply_markup: keyboard });
          console.log('Welcome message sent');
        } catch (error) {
          console.error('Error processing /start command:', error);
          await bot.sendMessage(chatId, 'An error occurred during registration. Please try again later.');
        }
      } else if (text === 'Invite a friend') {
        const user = await users.findOne({ telegramId: userId.toString() });
        if (user && user.referralCode) {
          const referralLink = `https://t.me/${process.env.BOT_USERNAME}?start=${user.referralCode}`;
          await bot.sendMessage(chatId, `Share this link with your friends: ${referralLink}`);
        } else {
          await bot.sendMessage(chatId, 'Sorry, we couldn\'t find your referral code. Please try /start command again.');
        }
      } else {
        console.log(`Received unknown command: ${text}`);
        await bot.sendMessage(chatId, 'Sorry, I don\'t understand this command. Try /start');
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