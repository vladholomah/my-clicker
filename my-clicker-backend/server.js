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

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
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

async function getOrCreateUser(users, userId, firstName, lastName, username) {
  let user = await users.findOne({ telegramId: userId });
  if (!user) {
    console.log('User not found, creating a new one');
    const referralCode = generateReferralCode();
    user = {
      telegramId: userId,
      firstName: firstName || 'Unknown',
      lastName: lastName || 'User',
      username: username || 'unknown',
      coins: 0,
      totalCoins: 0,
      referralCode: referralCode,
      referrals: [],
      referredBy: null,
      avatar: null,
      level: 'Beginner'
    };
    await users.insertOne(user);
  }
  return user;
}

async function getFriends(users, userId) {
  return await users.find({ referredBy: userId }).toArray();
}

app.get('/api/getUserData', async (req, res) => {
  const { userId } = req.query;
  console.log('Received getUserData request for userId:', userId);

  try {
    const db = await connectToDatabase();
    const users = db.collection('users');

    const user = await getOrCreateUser(users, userId);
    const friends = await getFriends(users, userId);

    const response = {
      user: {
        telegramId: user.telegramId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        coins: parseInt(user.coins) || 0,
        totalCoins: parseInt(user.totalCoins) || 0,
        level: user.level || 'Beginner',
        avatar: user.avatar
      },
      friends: friends.map(friend => ({
        telegramId: friend.telegramId,
        firstName: friend.firstName,
        lastName: friend.lastName,
        username: friend.username,
        coins: parseInt(friend.coins) || 0,
        totalCoins: parseInt(friend.totalCoins) || 0,
        level: friend.level || 'Beginner',
        avatar: friend.avatar
      })),
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

async function removeTestUser() {
  const db = await connectToDatabase();
  const users = db.collection('users');

  const testUser = await users.findOne({ telegramId: "12345" });
  if (testUser) {
    console.log('Test user found, removing...');
    const deleteResult = await users.deleteOne({ telegramId: "12345" });
    console.log('Test user delete result:', deleteResult);

    // Update referredBy for users who were referred by the test user
    const updateResult = await users.updateMany(
      { referredBy: "12345" },
      { $set: { referredBy: null } }
    );
    console.log('Updated referredBy for users:', updateResult);
  } else {
    console.log('Test user not found');
  }
}

// Call this function once when the server starts
removeTestUser().then(() => console.log('Finished removing test user'));