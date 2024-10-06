import { Pool } from 'pg';
import TelegramBot from 'node-telegram-bot-api';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const bot = new TelegramBot(process.env.BOT_TOKEN);

const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const addReferralBonus = async (client, referrerId, newUserId, bonusAmount) => {
  console.log(`Adding referral bonus: referrerId=${referrerId}, newUserId=${newUserId}, bonusAmount=${bonusAmount}`);

  await client.query(`
    UPDATE users 
    SET referrals = array_append(referrals, $1),
        coins = coins + $2,
        total_coins = total_coins + $2
    WHERE telegram_id = $3
  `, [newUserId, bonusAmount, referrerId]);

  await client.query(`
    UPDATE users
    SET coins = coins + $1,
        total_coins = total_coins + $1,
        referred_by = $2
    WHERE telegram_id = $3
  `, [bonusAmount, referrerId, newUserId]);
};

const getOrCreateUser = async (client, userId, firstName, lastName, username) => {
  const { rows } = await client.query('SELECT * FROM users WHERE telegram_id = $1', [userId]);
  if (rows.length === 0) {
    console.log('User not found, creating a new one');
    const referralCode = generateReferralCode();
    const newUser = await client.query(`
      INSERT INTO users (telegram_id, first_name, last_name, username, coins, total_coins, referral_code, referrals, referred_by, avatar, level)
      VALUES ($1, $2, $3, $4, 0, 0, $5, ARRAY[]::text[], NULL, NULL, 'Beginner')
      RETURNING *
    `, [userId, firstName || 'Unknown', lastName || 'User', username || 'unknown', referralCode]);
    return newUser.rows[0];
  }
  return rows[0];
};

const botHandler = async (req, res) => {
  console.log('Bot handler called');
  console.log('Webhook received:', JSON.stringify(req.body, null, 2));

  const client = await pool.connect();
  try {
    if (req.body && req.body.message) {
      const { chat: { id: chatId }, text, from: { id: userId, first_name, last_name, username } } = req.body.message;
      console.log(`Received message: ${text} from user ${userId}`);

      if (text.startsWith('/start')) {
        console.log(`Processing /start command for user ${userId}`);
        try {
          const args = text.split(' ');
          const referrerCode = args.length > 1 ? args[1] : null;
          console.log(`Referrer code: ${referrerCode}`);

          let user = await getOrCreateUser(client, userId.toString(), first_name, last_name, username);
          console.log('User:', user);

          if (referrerCode && !user.referred_by) {
            console.log(`Processing referral for code: ${referrerCode}`);
            const { rows: [referrer] } = await client.query('SELECT * FROM users WHERE referral_code = $1', [referrerCode]);
            console.log('Referrer found:', referrer);
            if (referrer && referrer.telegram_id !== userId.toString()) {
              const bonusAmount = 5000;
              await addReferralBonus(client, referrer.telegram_id, userId.toString(), bonusAmount);
              console.log(`User ${userId} added to referrals of ${referrer.telegram_id}`);

              await bot.sendMessage(chatId, `Вітаємо! Ви отримали ${bonusAmount} монет як бонус за реферальне посилання!`);
              await bot.sendMessage(referrer.telegram_id, `Ваш друг приєднався за вашим реферальним посиланням. Ви отримали ${bonusAmount} монет як бонус!`);
            } else {
              console.log('Invalid referrer or user trying to refer themselves');
              await bot.sendMessage(chatId, 'Ласкаво просимо до бота Holmah Coin!');
            }
          } else {
            console.log('User already has a referrer or no referral code provided');
            await bot.sendMessage(chatId, 'Ласкаво просимо до бота Holmah Coin!');
          }

          const referralLink = `https://t.me/${process.env.BOT_USERNAME}?start=${user.referral_code}`;
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
  } finally {
    client.release();
  }
};

export default botHandler;