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

const logEnvVar = (name) => console.log(`${name}:`, process.env[name] ? (name === 'BOT_TOKEN' ? 'Set' : process.env[name]) : 'Not set');

['MONGODB_URI', 'BOT_TOKEN', 'FRONTEND_URL', 'BOT_USERNAME'].forEach(logEnvVar);

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
    client = new MongoClient(uri);
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

async function getUserProfilePhoto(userId) {
  try {
    const bot = new TelegramBot(process.env.BOT_TOKEN);
    const userProfilePhotos = await bot.getUserProfilePhotos(userId, { limit: 1 });
    if (userProfilePhotos.photos && userProfilePhotos.photos.length > 0) {
      const fileId = userProfilePhotos.photos[0][0].file_id;
      const file = await bot.getFile(fileId);
      return `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
    }
  } catch (error) {
    console.error('Error fetching user profile photo:', error);
  }
  return null;
}

async function getOrCreateUser(users, userId) {
  let user = await users.findOne({ telegramId: userId });
  if (!user) {
    console.log('User not found, creating a new one');
    const avatar = await getUserProfilePhoto(userId);
    user = {
      telegramId: userId,
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      coins: 0,
      referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      referrals: [],
      avatar: avatar
    };
    await users.insertOne(user);
  } else if (!user.avatar) {
    user.avatar = await getUserProfilePhoto(userId);
    await users.updateOne({ telegramId: userId }, { $set: { avatar: user.avatar } });
  }
  return user;
}

async function getFriends(users, referrals) {
  return await users.find({ telegramId: { $in: referrals || [] } }).toArray();
}

app.get('/api/getUserData', async (req, res) => {
  const { userId } = req.query;
  console.log('Received getUserData request for userId:', userId);

  try {
    const db = await connectToDatabase();
    const users = db.collection('users');

    const user = await getOrCreateUser(users, userId);
    const friends = await getFriends(users, user.referrals);

    const response = {
      friends: await Promise.all(friends.map(async friend => ({
        telegramId: friend.telegramId,
        firstName: friend.firstName,
        lastName: friend.lastName,
        username: friend.username,
        coins: parseInt(friend.coins) || 0,
        level: friend.level || 'Beginner',
        totalCoins: parseInt(friend.totalCoins) || parseInt(friend.coins) || 0,
        avatar: friend.avatar || await getUserProfilePhoto(friend.telegramId)
      }))),
      referralCode: user.referralCode,
      referralLink: `https://t.me/${process.env.BOT_USERNAME}?start=${user.referralCode}`
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));
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