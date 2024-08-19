const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  console.log('getFriends API called with query:', req.query);
  const { userId } = req.query;

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
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

    const user = await users.findOne({ telegramId: userId });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user);
    console.log('User referrals:', user.referrals);

    const friends = await users.find({ telegramId: { $in: user.referrals || [] } }).toArray();
    console.log('Friends found:', friends.length);

    const friendsData = friends.map(friend => ({
      telegramId: friend.telegramId,
      firstName: friend.firstName,
      lastName: friend.lastName,
      username: friend.username,
      coins: friend.coins || 0,
      level: friend.level || 'Beginner',
      totalCoins: friend.totalCoins || '0',
      avatar: friend.avatar || null
    }));

    const referralLink = `https://t.me/${process.env.BOT_USERNAME}?start=${user.referralCode}`;
    res.status(200).json({ friends: friendsData, referralCode: user.referralCode, referralLink });
  } catch (error) {
    console.error('Error in getFriends:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    await client.close();
  }
};