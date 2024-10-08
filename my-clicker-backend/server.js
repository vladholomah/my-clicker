import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Створюємо пул з'єднань один раз
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Перевірка з'єднання з базою даних
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to the database');
    release();
  }
});

// Ендпоінт для обробки рефералів
app.post('/api/referral', async (req, res) => {
  console.log('Received referral request:', req.method, req.url);
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
});

// Тестовий ендпоінт
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Для локального запуску
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Експорт для Vercel
export default app;