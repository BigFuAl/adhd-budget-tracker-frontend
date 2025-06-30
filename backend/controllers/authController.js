// controllers/authController.js
const User   = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

/**
 * POST /api/auth/register
 */
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // 1) Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2) Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3) Create & save
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4) Respond with new user (no token yet)
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error registering user' });
  }
};

/**
 * POST /api/auth/login
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1) Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2) Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3) Sign JWT
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4) Respond with token + user info
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error logging in' });
  }
};

/**
 * GET /api/auth/profile
 * (protected — see authMiddleware)
 */
exports.getProfile = async (req, res) => {
  try {
    // authMiddleware has populated req.user
    const { _id, name, email } = req.user;
    res.json({
      message: 'Profile fetched successfully',
      user: { id: _id, name, email },
    });
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};