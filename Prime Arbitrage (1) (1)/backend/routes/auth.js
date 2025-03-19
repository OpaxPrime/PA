const express = require('express');
const router = express.Router();
const { register, login, getMe, updateSubscription } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

// Register user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user
router.get('/me', protect, getMe);

// Update subscription
router.put('/subscription', protect, updateSubscription);

module.exports = router;