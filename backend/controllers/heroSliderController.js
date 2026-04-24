const HeroSlider = require('../models/HeroSlider');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure Multer for Hero Images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/hero/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).single('image');

exports.upload = upload;

exports.getAllSliders = async (req, res) => {
  try {
    const sliders = await HeroSlider.find().sort({ order: 1 });
    res.json(sliders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSlider = async (req, res) => {
  try {
    const { title, subtitle, order } = req.body;
    const image = req.file ? `/uploads/hero/${req.file.filename}` : '';
    
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
      // Remove old image
      const oldPath = path.join(__dirname, '..', slider.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      slider.image = `/uploads/hero/${req.file.filename}`;
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
