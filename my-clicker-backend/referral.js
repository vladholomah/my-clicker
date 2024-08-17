const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  console.log('Received referral request:', req.method, req.url);
  console.log('Request body:', JSON.stringify(req.body));

  const { referrerId, newUserId } = req.body;
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('holmah_coin_db');
    const users = db.collection('users');

    let referrer = await users.findOne({ telegramId: referrerId });
    console.log('Referrer before update:', referrer);
    console.log('New user:', newUserId);

    if (!referrer) {
      referrer = { telegramId: referrerId, referrals: [] };
    }

    const updateResult = await users.updateOne(
      { telegramId: referrerId },
      { $addToSet: { referrals: newUserId } },
      { upsert: true }
    );
    console.log('Update result:', updateResult);

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