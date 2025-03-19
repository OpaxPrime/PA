const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const chatService = require('../utils/chatService');

// @desc    Send message to chat assistant
// @route   POST /api/chat/message
// @access  Private
router.post('/message', protect, async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }

    // Check if free user has reached their message limit
    if (req.user.subscription !== 'premium' && history && history.length > 10) {
      return res.status(403).json({
        success: false,
        message: 'Free users are limited to 10 messages per conversation. Upgrade to Premium for unlimited chat assistance.'
      });
    }

    // Send message to Groq API
    const response = await chatService.sendMessage(message, history);

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;