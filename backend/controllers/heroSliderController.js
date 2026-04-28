const HeroSlider = require('../models/HeroSlider');
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
    },
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isProd = process.env.NODE_ENV === 'production';
      const uploadPath = path.join(isProd ? '/tmp' : __dirname, isProd ? '' : '..', 'uploads', 'hero');
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
}

exports.upload = multer({ storage: storage }).single('image');

exports.getAllSliders = async (req, res) => {
  try {
    const sliders = await HeroSlider.find().sort({ order: 1 });
    res.json(sliders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFilePath = (f) => f.path.startsWith('http') ? f.path : `/uploads/hero/${f.filename}`;

exports.createSlider = async (req, res) => {
  try {
    const { title, subtitle, order } = req.body;
    const image = req.file ? getFilePath(req.file) : '';
    
    const slider = new HeroSlider({
      image,
      title,
      subtitle,
      order: order || 0
    });

    const newSlider = await slider.save();
    res.status(201).json(newSlider);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSlider = async (req, res) => {
  try {
    const slider = await HeroSlider.findById(req.params.id);
    if (!slider) return res.status(404).json({ message: 'Slider not found' });

    const { title, subtitle, order, isActive } = req.body;
    
    if (req.file) {
      // Note: In production with Cloudinary, unlinking local files is not needed
      if (!slider.image.startsWith('http')) {
        const oldPath = path.join(__dirname, '..', slider.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      slider.image = getFilePath(req.file);
    }

    if (title) slider.title = title;
    if (subtitle) slider.subtitle = subtitle;
    if (order !== undefined) slider.order = order;
    if (isActive !== undefined) slider.isActive = isActive;

    const updatedSlider = await slider.save();
    res.json(updatedSlider);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSlider = async (req, res) => {
  try {
    const slider = await HeroSlider.findById(req.params.id);
    if (!slider) return res.status(404).json({ message: 'Slider not found' });

    // Remove file
    const filePath = path.join(__dirname, '..', slider.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await slider.deleteOne();
    res.json({ message: 'Slider deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
