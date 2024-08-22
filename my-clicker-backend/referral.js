const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  console.log('Received referral request:', req.method, req.url);
  console.log('Request body:', JSON.stringify(req.body));

  const { referrerId, newUserId } = req.body;

  if (!referrerId || !newUserId) {
    console.error('Missing referrerId or newUserId');
    return res.status(400).json({ success: false, error: 'Missing required parameters' });
  }

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
      referrer = { telegramId: referrerId, referrals: [], coins: 0 };
    }

    const updateResult = await users.updateOne(
      { telegramId: referrerId },
      {
        $addToSet: { referrals: newUserId },
        $inc: { coins: 5000 } // Bonus for referrer
      },
      { upsert: true }
    );
    console.log('Update result for referrer:', updateResult);

    let newUser = await users.findOne({ telegramId: newUserId });
    if (!newUser) {
      const insertResult = await users.insertOne({
        telegramId: newUserId,
        referrals: [],
        coins: 5000 // Bonus for new user
      });
      console.log('Insert result for new user:', insertResult);
    } else {
      const updateNewUserResult = await users.updateOne(
        { telegramId: newUserId },
        { $inc: { coins: 5000 } }
      );
      console.log('Update result for existing new user:', updateNewUserResult);
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