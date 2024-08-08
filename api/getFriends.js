const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  const { userId } = req.query;
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('holmah_coin_db');
    const users = db.collection('users');

    const user = await users.findOne({ telegramId: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const friends = await users.find({ telegramId: { $in: user.referrals } }).toArray();
    const friendsData = friends.map(friend => ({
      telegramId: friend.telegramId,
      coins: friend.coins
    }));

    res.status(200).json({ friends: friendsData });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
};