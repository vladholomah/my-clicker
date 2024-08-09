const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  console.log('getFriends API called with query:', req.query);
  const { userId } = req.query;

  if (!userId) {
    console.error('User ID not provided');
    return res.status(400).json({ error: 'User ID is required' });
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('holmah_coin_db');
    const users = db.collection('users');

    // Перевіряємо, чи існує користувач
    let user = await users.findOne({ telegramId: userId });

    if (!user) {
      console.log('User not found, creating new user');
      user = { telegramId: userId, referrals: [], coins: 0 };
      await users.insertOne(user);
      console.log('New user created:', user);
    } else {
      console.log('User found:', user);
    }

    // Отримуємо друзів (рефералів) користувача
    const friends = await users.find({ telegramId: { $in: user.referrals } }).toArray();
    console.log('Friends found:', friends.length);

    const friendsData = friends.map(friend => ({
      telegramId: friend.telegramId,
      coins: friend.coins || 0
    }));

    console.log('Sending response:', { friendsCount: friendsData.length });
    res.status(200).json({ friends: friendsData });
  } catch (error) {
    console.error('Error in getFriends:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
};