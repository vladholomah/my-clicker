const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

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
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    }
  }
  return client.db('holmah_coin_db');
}

app.get('/api/getFriends', async (req, res) => {
  const { userId } = req.query;
  console.log('Received getFriends request for userId:', userId);

  try {
    const db = await connectToDatabase();
    const users = db.collection('users');

    const user = await users.findOne({ telegramId: userId });
    if (!user) {
      console.log('User not found for getFriends');
      return res.status(404).json({ error: 'User not found' });
    }

    const friends = await users.find({ telegramId: { $in: user.referrals || [] } }).toArray();
    console.log('Friends found:', friends.length);

    res.json({ friends });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
        username: friend.username
      })),
      referralCode: user.referralCode || userId
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const botHandler = require('./bot');
app.post(`/bot${process.env.BOT_TOKEN}`, express.json(), (req, res) => {
  console.log('Webhook request received');
  console.log('Request body:', JSON.stringify(req.body));
  botHandler(req, res);
});

const referralHandler = require('./referral');
app.post('/api/referral', express.json(), referralHandler);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`CORS origin set to: ${process.env.FRONTEND_URL || '*'}`);
  console.log(`Webhook URL: ${process.env.REACT_APP_API_URL}/bot${process.env.BOT_TOKEN}`);
});

// Set webhook
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_TOKEN);

bot.setWebHook(`${process.env.REACT_APP_API_URL}/bot${process.env.BOT_TOKEN}`)
  .then(() => console.log('Webhook set successfully'))
  .catch((error) => console.error('Error setting webhook:', error));

process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});