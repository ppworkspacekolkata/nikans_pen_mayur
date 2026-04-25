const HeroSettings = require('../models/HeroSettings');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Storage Configuration
let storage;
if (process.env.CLOUDINARY_CLOUD_NAME) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'nikan_hero',
      allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
      resource_type: 'image'
    },
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', 'uploads', 'hero');
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, 'hero-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
  });
}

const upload = multer({ storage: storage }).any();

exports.upload = upload;

const getFilePath = (f) => f.path.startsWith('http') ? f.path : `/uploads/hero/${f.filename}`;

exports.getSettings = async (req, res) => {
  try {
    let settings = await HeroSettings.findOne();
    if (!settings) {
      settings = new HeroSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await HeroSettings.findOne();
    if (!settings) settings = new HeroSettings();

    const { title, subtitle, description, stats } = req.body;
    
    if (title) settings.title = title;
    if (subtitle) settings.subtitle = subtitle;
    if (description) settings.description = description;
    
    if (stats) {
      settings.stats = typeof stats === 'string' ? JSON.parse(stats) : stats;
    }

    // Handle Image Uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => getFilePath(f));
      settings.images = [...settings.images, ...newImages];
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error('Update Hero Error:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.removeImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const settings = await HeroSettings.findOne();
    if (!settings) return res.status(404).json({ message: 'Settings not found' });

    settings.images = settings.images.filter(img => img !== imageUrl);

    // If local file, delete it
    if (!imageUrl.startsWith('http')) {
        const filePath = path.join(__dirname, '..', imageUrl);
        if (fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch(e) { console.error(e); }
        }
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
