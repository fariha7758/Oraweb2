// backend/routes/auth.js
const express = require('express');
const router = express.Router();

// Sample route for testing
router.get('/test', (req, res) => {
  res.send('Auth route is working!');
});

module.exports = router;
