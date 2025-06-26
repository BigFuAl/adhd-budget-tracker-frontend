const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

// Route: POST /api/register
router.post('/register', registerUser);

// Route: POST /api/login
router.post('/login', loginUser);

// Route: GET /api/profile (protected)
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'Access granted to protected profile route',
    user: req.user
  });
  router.get('/test', (req, res) => {
  res.json({ message: 'Test route working' }); // Dummy comment to trigger redeploy
});
});

module.exports = router;