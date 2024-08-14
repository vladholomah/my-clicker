const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});