/* eslint-env node, commonjs */
/* eslint-disable no-undef */
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');

// Load environment variables from .env file
dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();
app.use(helmet()); // Secures HTTP headers

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://adhd-tracker-frontend.netlify.app',
  'https://agreeable-pebble-07982e410.2.azurestaticapps.net',
  'https://adhd-budget-tracker-frontend-f3gv9wgil-bigfuals-projects.vercel.app',
  'https://adhd-budget-tracker-frontend-u6hr-nym0cxwe5-bigfuals-projects.vercel.app'
];



// allow only your whitelisted + any .vercel.app, but reject others silently
app.use(cors({
  origin: (origin, callback) => {
    // allow Postman / no-Origin
    if (!origin) return callback(null, true);

    const isVercel = /\.vercel\.app$/.test(origin);
    if (allowedOrigins.includes(origin) || isVercel) {
      return callback(null, true);
    }

    // deny silently (no CORS headers), but don’t throw
    return callback(null, false);
  },
  credentials: true
}));

// preflight handler
app.options('*', cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isVercel = /\.vercel\.app$/.test(origin);
    if (allowedOrigins.includes(origin) || isVercel) {
      return callback(null, true);
    }

    return callback(null, false);
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


(async () => {
  try {
    console.log('🛠 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected.');

    const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
})();