module.exports = (req, res) => {
  console.log('Test endpoint called');
  console.log('Request method:', req.method);
  console.log('Request headers:', JSON.stringify(req.headers));
  console.log('Request body:', JSON.stringify(req.body));
  res.status(200).json({ message: 'Test endpoint is working' });
};