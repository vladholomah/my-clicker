import pg from 'pg';
const { Pool } = pg;

// Створюємо пул з'єднань один раз
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Експортуємо функцію-обробник для Vercel
export default async function handler(req, res) {
  console.log('Received request:', req.method, req.url);

  // Перевіряємо метод запиту
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  console.log('Request body:', JSON.stringify(req.body));

  const { referrerId, newUserId } = req.body;

  if (!referrerId || !newUserId) {
    console.error('Missing referrerId or newUserId');
    return res.status(400).json({ success: false, error: 'Missing required parameters' });
  }

  let client;
  try {
    client = await pool.connect();
    console.log('Connected to PostgreSQL');

    // Початок транзакції
    await client.query('BEGIN');

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

    // Завершення транзакції
    await client.query('COMMIT');

    console.log('Referral processed successfully');
    res.status(200).json({
      success: true,
      referrerBonus: bonusAmount,
      newUserBonus: bonusAmount
    });
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    console.error('Error processing referral:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (client) client.release();
  }
}