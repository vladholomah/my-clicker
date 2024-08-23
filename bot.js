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

  // Оновлюємо реферера
  const referrerUpdateResult = await users.updateOne(
    { telegramId: referrerId },
    {
      $addToSet: { referrals: newUserId },
      $inc: { coins: bonusAmount, totalCoins: bonusAmount }
    }
  );
  console.log('Referrer update result:', referrerUpdateResult);

  // Оновлюємо нового користувача
  const newUserUpdateResult = await users.updateOne(
    { telegramId: newUserId },
    {
      $inc: { coins: bonusAmount, totalCoins: bonusAmount },
      $set: { referredBy: referrerId }
    }
  );
  console.log('New user update result:', newUserUpdateResult);

  return { referrerUpdateResult, newUserUpdateResult };
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
          console.log('Existing user:', user);

          if (!user) {
            const referralCode = generateReferralCode();
            user = {
              telegramId: userId.toString(),
              coins: 0,
              totalCoins: 0,
              firstName: first_name,
              lastName: last_name,
              username: username,
              referralCode: referralCode,
              referrals: [],
              referredBy: null,
              level: 'Beginner',
              avatar: null
            };
            const insertResult = await users.insertOne(user);
            console.log('New user created:', user, 'Insert result:', insertResult);
          } else if (!user.referralCode || user.referralCode === "ABC123") {
            const newReferralCode = generateReferralCode();
            const updateResult = await users.updateOne(
              { telegramId: userId.toString() },
              { $set: { referralCode: newReferralCode } }
            );
            user.referralCode = newReferralCode;
            console.log(`Updated referral code for user ${userId} to ${newReferralCode}`, 'Update result:', updateResult);
          }

          if (referrerCode && !user.referredBy) {
            console.log(`Processing referral for code: ${referrerCode}`);
            const referrer = await users.findOne({ referralCode: referrerCode });
            console.log('Referrer found:', referrer);
            if (referrer && referrer.telegramId !== userId.toString()) {
              const bonusAmount = 5000;
              const addBonusResult = await addReferralBonus(users, referrer.telegramId, userId.toString(), bonusAmount);
              console.log(`User ${userId} added to referrals of ${referrer.telegramId}`, 'Add bonus result:', addBonusResult);

              // Оновлюємо локальний об'єкт користувача
              user.referredBy = referrer.telegramId;
              user.coins += bonusAmount;
              user.totalCoins += bonusAmount;

              await bot.sendMessage(chatId, `Welcome! You received ${bonusAmount} coins as a referral bonus!`);
              await bot.sendMessage(referrer.telegramId, `Your friend joined using your referral link. You received ${bonusAmount} coins as a bonus!`);
            } else {
              console.log('Invalid referrer or user trying to refer themselves');
            }
          } else {
            console.log('User already has a referrer or no referral code provided');
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
  }
};

export default botHandler;