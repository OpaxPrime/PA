const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Mock user data for demo purposes
const users = [
  {
    id: '12345',
    name: 'Demo User',
    email: 'demo@example.com',
    subscription: 'free'
  },
  {
    id: '67890',
    name: 'Premium User',
    email: 'premium@example.com',
    subscription: 'premium'
  }
];

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: users
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, (req, res) => {
  const user = users.find(u => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', protect, (req, res) => {
  let user = users.find(u => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check if user is updating their own profile
  if (req.user.id !== req.params.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to update this user'
    });
  }

  // Update user
  user = { ...user, ...req.body };

  res.status(200).json({
    success: true,
    data: user
  });
});

module.exports = router;