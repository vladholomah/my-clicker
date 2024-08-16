const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-vercel-app-url.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not defined');
  process.exit(1);
}

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
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

app.get('/api/getUserData', async (req, res) => {
  const { userId } = req.query;

  try {
    const db = client.db('holmah_coin_db');
    const users = db.collection('users');

    const user = await users.findOne({ telegramId: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const friends = await users.find({ telegramId: { $in: user.referrals || [] } }).toArray();

    res.json({
      friends: friends.map(friend => ({
        telegramId: friend.telegramId,
        firstName: friend.firstName,
        lastName: friend.lastName,
        username: friend.username
      })),
      referralCode: user.referralCode || userId // Використовуємо telegramId як резервний варіант
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const botHandler = require('./bot');
app.post('/bot', (req, res) => {
  console.log('Received bot request:', req.body);
  botHandler(req, res);
});

const referralHandler = require('./referral');
app.post('/api/referral', referralHandler);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});