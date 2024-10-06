import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  console.log('getFriends API called with query:', req.query);
  const { userId } = req.query;

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (!userId) {
    console.error('User ID not provided');
    return res.status(400).json({ error: 'User ID is required' });
  }

  const client = await pool.connect();
  try {
    console.log('Connected to PostgreSQL');

    const { rows: [user] } = await client.query('SELECT * FROM users WHERE telegram_id = $1', [userId]);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user);

    const { rows: friends } = await client.query(`
      SELECT * FROM users WHERE telegram_id = ANY($1::text[])
    `, [user.referrals || []]);
    console.log('Friends found:', friends.length);

    const friendsData = friends.map(friend => ({
      telegramId: friend.telegram_id,
      firstName: friend.first_name,
      lastName: friend.last_name,
      username: friend.username,
      coins: friend.coins || 0,
      level: friend.level || 'Beginner',
      totalCoins: friend.total_coins || friend.coins || 0,
      avatar: friend.avatar || null
    }));

    const referralLink = `https://t.me/${process.env.BOT_USERNAME}?start=${user.referral_code}`;
    console.log('Referral link generated:', referralLink);
    const response = {
      user: {
        telegramId: user.telegram_id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        coins: user.coins || 0,
        totalCoins: user.total_coins || user.coins || 0,
        level: user.level || 'Beginner',
        avatar: user.avatar || null
      },
      friends: friendsData,
      referralCode: user.referral_code,
      referralLink,
    };
    console.log('Sending response:', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getFriends:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    client.release();
  }
};