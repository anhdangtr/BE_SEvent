const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, 'src', '.env'), // Luôn load src/.env
  override: true
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const reminderRoutes = require('./src/routes/reminderRoutes');
const savedEventRoutes = require('./src/routes/savedEventRoutes');
const getProfileRoutes = require('./src/routes/getProfileRoutes');
const userRoutes = require('./src/routes/userRoutes');
//send reminder
const {startReminderScheduler} = require('./src/service/reminderSchedual');



// Load environment variables; prefer `src/.env` when present
const altEnv = path.join(__dirname, 'src', '.env');
if (fs.existsSync(altEnv)) {
  dotenv.config({ path: altEnv, override: true });
  console.log(`[dotenv] loaded env from ${altEnv}`);
}

// Debug - Kiểm tra email config (after loading env files)
console.log('\n=== EMAIL CONFIG ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);
console.log('===================\n');

const app = express();

// Simple request logger to help debug missing routes
app.use((req, res, next) => {
  console.log(`[req] ${req.method} ${req.originalUrl}`);
  next();
});

// Danh sách các front-end được phép
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://sevent.onrender.com',
  'https://sevent-chi.vercel.app'
];

// Middleware CORS duy nhất
app.use(cors({
  origin: function(origin, callback) {
    // Log origin for debugging
    console.log('Request origin:', origin);
    
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("Middleware oke");


// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
  console.error('✗ MONGODB_URI is not defined. Create a `.env` with `MONGODB_URI` or set the environment variable.');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✓ Kết nối MongoDB thành công');
  })
  .catch((error) => {
    console.error('✗ Lỗi kết nối MongoDB:', error.message);
    process.exit(1);
  });

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'API Server đang chạy' });
});
console.log("Basic route oke");

// Authentication Routes
app.use('/api/auth', authRoutes);
console.log("Router auth oke");

//Fetch all revent routes
app.use('/api/events', eventRoutes);
console.log("Router event oke");

// Category Routes
app.use('/api', categoryRoutes);
console.log("Router category oke");

// Reminder Routes
app.use('/api/reminders', reminderRoutes);
console.log("Router reminder oke");

// Saved Event Routes
app.use('/api/saved-events', savedEventRoutes);
console.log("Router saved-events oke");

//get profile route
app.use('/api/info', getProfileRoutes);
console.log("Router get profile oke");

// User Routes
app.use('/api/user', userRoutes);
console.log("Router user oke");

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Lỗi server'
  });
});

// Start reminder scheduler
startReminderScheduler();

// 404 handler - include requested path for easier debugging
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route không tìm thấy: ${req.method} ${req.originalUrl}`
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server đang chạy tại http://localhost:${PORT}`);
});