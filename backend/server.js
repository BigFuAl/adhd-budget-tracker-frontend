const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');

// Load environment variables from .env file
dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET); // <-- Add th

const app = express();
app.use(helmet()); // Secures HTTP headers

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many login attempts from this IP. Try again later."
});

// Apply limiter only to /api/login
app.use('/api/login', limiter);

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://adhd-tracker-frontend.netlify.app', // <-- replace with actual Netlify URL if different
   'https://agreeable-pebble-07982e410.2.azurestaticapps.net',
   'https://adhd-budget-tracker-frontend.vercel.app'
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin'));
    }
  },
  credentials: true
}));
app.use(express.json()); // Parses incoming JSON

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working! 🔧' });
});

// Auth Routes

app.use('/api/auth', authRoutes); // ✅ This exposes /api/auth/register and /api/auth/login
app.use('/api/expenses', expenseRoutes);

// Connect to MongoDB
connectDB(); // ← And you need this too

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});