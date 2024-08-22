import { MongoClient } from 'mongodb';
import TelegramBot from 'node-telegram-bot-api';

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

const botHandler = async (req, res) => {
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

      if (text.startsWith('/start')) {
        console.log(`Processing /start command for user ${userId}`);
        try {
          const args = text.split(' ');
          const referrerCode = args.length > 1 ? args[1] : null;

          let user = await users.findOne({ telegramId: userId.toString() });

          if (!user) {
            const referralCode = generateReferralCode();
            user = {
              telegramId: userId.toString(),
              coins: 0,
              firstName: first_name,
              lastName: last_name,
              username: username,
              referralCode: referralCode,
              referrals: []
            };
            await users.insertOne(user);
            console.log('New user created:', user);

            if (referrerCode) {
              const referrer = await users.findOne({ referralCode: referrerCode });
              if (referrer && referrer.telegramId !== userId.toString()) {
                await users.updateOne(
                  { telegramId: referrer.telegramId },
                  { $addToSet: { referrals: userId.toString() } }
                );
                console.log(`User ${userId} added to referrals of ${referrer.telegramId}`);
                // Додавання бонусів
                const bonusAmount = 5000;
                await users.updateOne(
                  { telegramId: referrer.telegramId },
                  { $inc: { coins: bonusAmount } }
                );
                await users.updateOne(
                  { telegramId: userId.toString() },
                  { $inc: { coins: bonusAmount } }
                );
                await bot.sendMessage(chatId, `Welcome! You received ${bonusAmount} coins as a referral bonus!`);
                await bot.sendMessage(referrer.telegramId, `Your friend joined using your referral link. You received ${bonusAmount} coins as a bonus!`);
              }
            }
          }

          const referralLink = `https://t.me/${process.env.BOT_USERNAME}?start=${user.referralCode}`;
          const keyboard = {
            keyboard: [
              [{ text: 'Play Now', web_app: { url: process.env.FRONTEND_URL } }],
              [{ text: 'Invite Friends', callback_data: 'invite_friends' }]
            ],
            resize_keyboard: true
          };

          await bot.sendMessage(chatId, `Welcome to Holmah Coin bot!\nYour referral link is: ${referralLink}\nUse the buttons below to start playing or invite friends:`, { reply_markup: keyboard });
          console.log('Welcome message sent');
        } catch (error) {
          console.error('Error processing /start command:', error);
          await bot.sendMessage(chatId, 'An error occurred during registration. Please try again later.');
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

export default botHandler;