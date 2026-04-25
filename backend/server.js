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

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/subcategories', require('./routes/subCategoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/hero-settings', require('./routes/heroSettingsRoutes'));
app.use('/api/video-posts', require('./routes/videoRoutes'));

// Debug Ping Route
app.get('/api/ping', (req, res) => {
  res.json({ 
    status: 'ok', 
    env: process.env.NODE_ENV,
    hasMongo: !!process.env.MONGO_URI,
    time: new Date().toISOString()
  });
});

// Serve Static Files (for uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    // Exclude API routes and uploads
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
  });
}

// Global Ping (no prefix)
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', msg: 'Global ping works' });
});

if (process.env.NODE_ENV !== 'production') {
  // Basic Route for development
  app.get('/', (req, res) => {
    res.send('Nikan Pen API is running...');
  });
}

// Database Connection
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nikan_pen';

console.log('Connecting to MongoDB...');
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
