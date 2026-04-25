const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

// --- Database Connection Utility ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://mypassportpulse_db_user:5isDlRPJR70pzLTo@nikanspen.qpom9sq.mongodb.net/?appName=nikanspen';
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb;
  try {
    const db = await mongoose.connect(MONGO_URI);
    cachedDb = db;
    return db;
  } catch (err) {
    throw err;
  }
}

// Ensure DB is connected for every /api request
app.use('/api', async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    res.status(500).json({ 
      error: 'Database Connection Error', 
      details: err.message 
    });
  }
});

// Routes - Require relative to the current file (api/index.js)
app.use('/api/auth', require('../backend/routes/authRoutes'));
app.use('/api/categories', require('../backend/routes/categoryRoutes'));
app.use('/api/subcategories', require('../backend/routes/subCategoryRoutes'));
app.use('/api/products', require('../backend/routes/productRoutes'));
app.use('/api/enquiries', require('../backend/routes/enquiryRoutes'));
app.use('/api/media', require('../backend/routes/mediaRoutes'));
app.use('/api/hero-settings', require('../backend/routes/heroSettingsRoutes'));
app.use('/api/video-posts', require('../backend/routes/videoRoutes'));

// Debug Ping Route
app.get('/api/ping', (req, res) => {
  res.json({ 
    status: 'ok', 
    env: process.env.NODE_ENV,
    hasMongo: !!process.env.MONGO_URI,
    time: new Date().toISOString(),
    url: req.url
  });
});

// Serve Static Files (for uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'backend', 'uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
  });
}

// Global Ping (no prefix)
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', msg: 'Global ping works from API index' });
});

module.exports = app;
