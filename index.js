const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');

// Load environment variables from the project directory explicitly so
// running node with a different cwd still loads BE/.env
const envPath = path.join(__dirname, '.env');
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.log(`[dotenv] no .env found at ${envPath} or failed to load`);
} else {
  console.log(`[dotenv] loaded env from ${envPath}`);
}
const altEnv = path.join(__dirname, 'src', '.env');
if (fs.existsSync(altEnv)) {
  dotenv.config({ path: altEnv, override: true });
  console.log(`[dotenv] loaded env from ${altEnv}`);
}

const app = express();

// Simple request logger to help debug missing routes
app.use((req, res, next) => {
  console.log(`[req] ${req.method} ${req.originalUrl}`);
  next();
});

// Configure CORS origins from env, include 127.0.0.1 variants, and be
// permissive in non-production to avoid dev-time 403 issues.
const rawCors = process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173,http://localhost:5174';
const allowedOrigins = rawCors.split(',').map(s => s.trim()).filter(Boolean);
// add 127.0.0.1 variants for convenience
allowedOrigins.forEach(orig => {
  try {
    const u = new URL(orig);
    if (u.hostname === 'localhost') {
      const alt = `${u.protocol}//127.0.0.1${u.port ? `:${u.port}` : ''}`;
      if (!allowedOrigins.includes(alt)) allowedOrigins.push(alt);
    }
  } catch (e) {}
});

app.use((req, res, next) => {
  // Log incoming origin for debugging CORS issues
  console.log('[CORS] incoming origin ->', req.headers.origin);
  next();
});

app.use(cors({
  origin: function(origin, callback) {
    // allow non-browser requests (curl, server-to-server)
    if (!origin) return callback(null, true);
    // allow explicitly allowed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // in development, allow all origins to avoid blocking the frontend dev server
    if ((process.env.NODE_ENV || 'development') !== 'production') return callback(null, true);
    // otherwise deny
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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


// Routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("express oke");

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


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Lỗi server'
  });
});

// 404 handler - include requested path for easier debugging
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route không tìm thấy: ${req.method} ${req.originalUrl}`
  });
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n🚀 Server đang chạy tại http://localhost:${PORT}`);
});