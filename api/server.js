const express = require('express');
const getFriends = require('./getFriends');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  console.log('Received headers:', req.headers);
  next();
});

// Додайте цей middleware для обробки CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/getFriends', getFriends);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});