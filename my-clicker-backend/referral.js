import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async (req, res) => {
  console.log('Received referral request:', req.method, req.url);
  console.log('Request body:', JSON.stringify(req.body));

  const { referrerId, newUserId } = req.body;

  if (!referrerId || !newUserId) {
    console.error('Missing referrerId or newUserId');
    return res.status(400).json({ success: false, error: 'Missing required parameters' });
  }

  const client = await pool.connect();
  try {
    console.log('Connected to PostgreSQL');

    const { rows: [referrer] } = await client.query('SELECT * FROM users WHERE telegram_id = $1', [referrerId]);
    console.log('Referrer before update:', referrer);
    console.log('New user:', newUserId);

    if (!referrer) {
      console.error('Referrer not found');
      return res.status(404).json({ success: false, error: 'Referrer not found' });
    }

    const bonusAmount = 5000;

    await client.query(`
      UPDATE users 
      SET referrals = array_append(referrals, $1),
          coins = coins + $2,
          total_coins = total_coins + $2
      WHERE telegram_id = $3
    `, [newUserId, bonusAmount, referrerId]);

    const { rows: [newUser] } = await client.query('SELECT * FROM users WHERE telegram_id = $1', [newUserId]);
    if (!newUser) {
      await client.query(`
        INSERT INTO users (telegram_id, referrals, coins, total_coins, level, referred_by)
        VALUES ($1, ARRAY[]::text[], $2, $2, 'Beginner', $3)
      `, [newUserId, bonusAmount, referrerId]);
    } else {
      await client.query(`
        UPDATE users
        SET coins = coins + $1,
            total_coins = total_coins + $1,
            referred_by = $2
        WHERE telegram_id = $3
      `, [bonusAmount, referrerId, newUserId]);
    }

    console.log('Referral processed successfully');
    res.status(200).json({
      success: true,
      referrerBonus: bonusAmount,
      newUserBonus: bonusAmount
    });
  } catch (error) {
    console.error('Error processing referral:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
};