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

const addReferralBonus = async (users, referrerId, newUserId, bonusAmount) => {
  console.log(`Adding referral bonus: referrerId=${referrerId}, newUserId=${newUserId}, bonusAmount=${bonusAmount}`);

  const referrerUpdate = await users.updateOne(
    { telegramId: referrerId },
    {
      $addToSet: { referrals: newUserId },
      $inc: { coins: bonusAmount, totalCoins: bonusAmount }
    }
  );
  console.log('Referrer update result:', referrerUpdate);

  const newUserUpdate = await users.updateOne(
    { telegramId: newUserId },
    {
      $inc: { coins: bonusAmount, totalCoins: bonusAmount },
      $set: { referredBy: referrerId }
    }
  );
  console.log('New user update result:', newUserUpdate);

  return { referrerUpdate, newUserUpdate };
};

const getOrCreateUser = async (users, userId, firstName, lastName, username) => {
  let user = await users.findOne({ telegramId: userId });
  if (!user) {
    console.log('User not found, creating a new one');
    const referralCode = generateReferralCode();
    user = {
      telegramId: userId,
      firstName: firstName || 'Unknown',
      lastName: lastName || 'User',
      username: username || 'unknown',
      coins: 0,
      totalCoins: 0,
      referralCode: referralCode,
      referrals: [],
      referredBy: null,
      avatar: null,
      level: 'Beginner'
    };
    await users.insertOne(user);
    console.log('New user created:', user);
  } else {
    console.log('Existing user found:', user);
  }
  return user;
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
          console.log(`Referrer code: ${referrerCode}`);

          let user = await getOrCreateUser(users, userId.toString(), first_name, last_name, username);
          console.log('User:', user);

          if (referrerCode && !user.referredBy) {
            console.log(`Processing referral for code: ${referrerCode}`);
            const referrer = await users.findOne({ referralCode: referrerCode });
            console.log('Referrer found:', referrer);
            if (referrer && referrer.telegramId !== userId.toString()) {
              const bonusAmount = 5000;
              await addReferralBonus(users, referrer.telegramId, userId.toString(), bonusAmount);
              console.log(`User ${userId} added to referrals of ${referrer.telegramId}`);

              await bot.sendMessage(chatId, `Вітаємо! Ви отримали ${bonusAmount} монет як бонус за реферальне посилання!`);
              await bot.sendMessage(referrer.telegramId, `Ваш друг приєднався за вашим реферальним посиланням. Ви отримали ${bonusAmount} монет як бонус!`);
            } else {
              console.log('Invalid referrer or user trying to refer themselves');
              await bot.sendMessage(chatId, 'Ласкаво просимо до бота Holmah Coin!');
            }
          } else {
            console.log('User already has a referrer or no referral code provided');
            await bot.sendMessage(chatId, 'Ласкаво просимо до бота Holmah Coin!');
          }

          const referralLink = `https://t.me/${process.env.BOT_USERNAME}?start=${user.referralCode}`;
          const keyboard = {
            keyboard: [
              [{ text: 'Грати зараз', web_app: { url: process.env.FRONTEND_URL } }],
              [{ text: 'Запросити друзів', callback_data: 'invite_friends' }]
            ],
            resize_keyboard: true
          };

          await bot.sendMessage(chatId, `Ваше реферальне посилання: ${referralLink}\nВикористовуйте кнопки нижче, щоб почати гру або запросити друзів:`, { reply_markup: keyboard });
          console.log('Welcome message sent');
        } catch (error) {
          console.error('Error processing /start command:', error);
          await bot.sendMessage(chatId, 'Сталася помилка. Будь ласка, спробуйте пізніше.');
        }
      } else {
        console.log(`Received unknown command: ${text}`);
        await bot.sendMessage(chatId, 'Вибачте, я не розумію цю команду. Спробуйте /start');
      }
    } else {
      console.log('Received request without message');
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('General error:', error);
    console.error('Error stack:', error.stack);
    res.status(200).json({ ok: true }); // Always respond with 200 OK for Telegram
  }
};

export default botHandler;