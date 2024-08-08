// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Зберігання користувачів та їх рефералів (в реальному проекті це було б у базі даних)
const users = {};

app.post('/api/referral', (req, res) => {
  const { referrerId, newUserId } = req.body;

  if (!users[referrerId]) {
    users[referrerId] = { referrals: [] };
  }

  users[referrerId].referrals.push(newUserId);

  res.json({ success: true, message: 'Referral processed successfully' });
});

app.get('/api/referrals/:userId', (req, res) => {
  const userId = req.params.userId;
  const userReferrals = users[userId] ? users[userId].referrals : [];

  res.json({ referrals: userReferrals });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});