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



app.use(cors({
  origin: (origin, callback) => {
    // 1) allow Postman/no-origin
    if (!origin) return callback(null, true);

    // 2) allow your explicit list…
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // 3) …and *any* Vercel preview or production domain under “.vercel.app”
    if (/\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // otherwise block
    return callback(new Error(`CORS not allowed: ${origin}`));
  },
  credentials: true
}));

// same for preflights:
app.options('*', cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS not allowed: ${origin}`));
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