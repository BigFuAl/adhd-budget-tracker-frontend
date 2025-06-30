/* eslint-env node, commonjs */
const express = require('express');
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// limit to 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts. Please try again later.' }
});

router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);

// this route is protected by the JWT middleware
router.get('/profile', protect, getProfile);

// optional health-check
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are up 🛠' });
});

module.exports = router;