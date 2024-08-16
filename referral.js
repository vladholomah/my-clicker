const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  console.log('Received referral request:', req.method, req.url);
  console.log('Request body:', JSON.stringify(req.body));

  const { referrerId, newUserId } = req.body;
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('holmah_coin_db'); // Змінено на правильну назву бази даних
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

    console.log('Referral processed successfully');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing referral:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
};