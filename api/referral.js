// api/referral.js
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  const { referrerId, newUserId } = req.body;
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('your_database_name');
    const users = db.collection('users');

    let referrer = await users.findOne({ telegramId: referrerId });
    if (!referrer) {
      referrer = { telegramId: referrerId, referrals: [] };
    }
    referrer.referrals.push(newUserId);
    await users.updateOne(
      { telegramId: referrerId },
      { $set: referrer },
      { upsert: true }
    );

    let newUser = await users.findOne({ telegramId: newUserId });
    if (!newUser) {
      await users.insertOne({ telegramId: newUserId, referrals: [] });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
};