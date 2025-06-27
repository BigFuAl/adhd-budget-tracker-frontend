const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Apply rate limiter only to login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Please try again later.'
});

router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'Access granted to protected profile route',
    user: req.user
  });
});
router.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

module.exports = router;