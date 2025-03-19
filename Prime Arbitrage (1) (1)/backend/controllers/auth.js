const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    // In a real app, this would check the database
    // const userExists = await User.findOne({ email });

    // For demo purposes, we'll mock the user creation
    const user = {
      id: Math.random().toString(36).substring(2, 15),
      name,
      email,
      subscription: 'free'
    };

    // Create token
    const token = jwt.sign({ id: user.id },
      process.env.JWT_SECRET || 'arbitrageplatformsecret', { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    // In a real app, this would check the database
    // const user = await User.findOne({ email }).select('+password');

    // For demo purposes, we'll mock the user authentication
    // Assume valid credentials for demo@example.com / password123
    if (email !== 'demo@example.com' || password !== 'password123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = {
      id: '12345',
      name: 'Demo User',
      email: 'demo@example.com',
      subscription: 'free'
    };

    // Create token
    const token = jwt.sign({ id: user.id },
      process.env.JWT_SECRET || 'arbitrageplatformsecret', { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      token,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // In a real app, this would fetch from the database
    // const user = await User.findById(req.user.id);

    // For demo purposes, we'll use the user from the auth middleware
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user subscription
// @route   PUT /api/auth/subscription
// @access  Private
exports.updateSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;

    // In a real app, this would update the database
    // const user = await User.findByIdAndUpdate(
    //   req.user.id,
    //   { subscription },
    //   { new: true }
    // );

    // For demo purposes, we'll mock the update
    const user = {
      ...req.user,
      subscription
    };

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const jwt = require('jsonwebtoken');

// Missing import in auth.js controller