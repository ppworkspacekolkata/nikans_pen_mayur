const HeroSettings = require('../models/HeroSettings');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure Multer for Multiple Images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/hero/');
  },
  filename: (req, file, cb) => {
    cb(null, 'hero-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).any(); // Use .any() for debugging

exports.upload = upload;

exports.getSettings = async (req, res) => {
  try {
    let settings = await HeroSettings.findOne();
    if (!settings) {
      // Create default if not exists
      settings = new HeroSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  console.log('Update Settings Request Received');
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  try {
    let settings = await HeroSettings.findOne();
    if (!settings) settings = new HeroSettings();

    const { title, subtitle, description, stats } = req.body;
    
    if (title) settings.title = title;
    if (subtitle) settings.subtitle = subtitle;
    if (description) settings.description = description;
    
    // Parse stats if it comes as string (FormData)
    if (stats) {
      settings.stats = JSON.parse(stats);
    }

    // Handle Image Uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/hero/${f.filename}`);
      settings.images = [...settings.images, ...newImages];
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.removeImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const settings = await HeroSettings.findOne();
    if (!settings) return res.status(404).json({ message: 'Settings not found' });

    // Remove from array
    settings.images = settings.images.filter(img => img !== imageUrl);

    // Remove from filesystem
    const filePath = path.join(__dirname, '..', imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
