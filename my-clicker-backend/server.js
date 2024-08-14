const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Налаштування CORS для дозволу запитів з вашого фронтенду на Vercel
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-vercel-app-url.vercel.app', // Замініть на URL вашого фронтенду на Vercel або використовуйте змінну середовища
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Налаштування для статичних файлів React додатку (якщо потрібно)
app.use(express.static(path.join(__dirname, 'build')));

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

app.get('/api/getFriends', async (req, res) => {
  const { userId } = req.query;

  try {
    const db = client.db('holmah_coin_db');
    const users = db.collection('users');

    const user = await users.findOne({ telegramId: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const friends = await users.find({ telegramId: { $in: user.referrals || [] } }).toArray();

    res.json({ friends });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Додайте обробник для вебхуків Telegram
const botHandler = require('./bot');
app.post('/bot', botHandler);

// Додайте обробник для реферальної системи
const referralHandler = require('./referral');
app.post('/api/referral', referralHandler);

// Обробка всіх інших запитів до React додатку (якщо потрібно)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Обробка закриття з'єднання з базою даних при завершенні роботи сервера
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});