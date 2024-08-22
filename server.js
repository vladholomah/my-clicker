import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import botHandler from './bot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('BOT_TOKEN:', process.env.BOT_TOKEN ? 'Set' : 'Not set');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('BOT_USERNAME:', process.env.BOT_USERNAME);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not defined');
  process.exit(1);
}

let client;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      const db = client.db('holmah_coin_db');
      const collections = await db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    }
  }
  return client.db('holmah_coin_db');
}

app.get('/api/getUserData', async (req, res) => {
  const { userId } = req.query;
  console.log('Received getUserData request for userId:', userId);

  try {
    const db = await connectToDatabase();
    const users = db.collection('users');

    const user = await users.findOne({ telegramId: userId });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const friends = await users.find({ telegramId: { $in: user.referrals || [] } }).toArray();

    const response = {
      friends: friends.map(friend => ({
        telegramId: friend.telegramId,
        firstName: friend.firstName,
        lastName: friend.lastName,
        username: friend.username,
        coins: friend.coins || 0,
        level: friend.level || 'Beginner',
        totalCoins: friend.totalCoins || friend.coins.toString(),
        avatar: friend.avatar || null
      })),
      referralCode: user.referralCode,
      referralLink: `https://t.me/${process.env.BOT_USERNAME}?start=${user.referralCode}`
    };
    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post(`/bot${process.env.BOT_TOKEN}`, express.json(), botHandler);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`CORS origin set to: ${process.env.FRONTEND_URL || '*'}`);
  console.log(`Webhook URL: ${process.env.REACT_APP_API_URL}/bot${process.env.BOT_TOKEN}`);

  const bot = new TelegramBot(process.env.BOT_TOKEN);
  const webhookURL = `${process.env.REACT_APP_API_URL}/bot${process.env.BOT_TOKEN}`;
  bot.setWebHook(webhookURL)
    .then(() => console.log('Webhook set successfully'))
    .catch((error) => console.error('Error setting webhook:', error));
});

process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});