const SubCategory = require('../models/SubCategory');
const slugify = require('slugify');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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
      folder: 'nikan_subcategories',
      allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
    },
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isProd = process.env.NODE_ENV === 'production';
      const uploadPath = path.join(isProd ? '/tmp' : __dirname, isProd ? '' : '..', 'uploads', 'subcategories');
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
}

exports.upload = multer({ storage }).single('image');

const getFilePath = (f) => f.path.startsWith('http') ? f.path : `/uploads/subcategories/${f.filename}`;

exports.getAllSubCategories = async (req, res) => {
  try {
    const subs = await SubCategory.find().populate('category').sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getByCategory = async (req, res) => {
  try {
    const subs = await SubCategory.find({ category: req.params.categoryId });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSubCategory = async (req, res) => {
  try {
    const { name, description, category, isActive } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    
    let image = null;
    if (req.file) {
      image = getFilePath(req.file);
    }
    
    const sub = new SubCategory({ name, description, category, isActive, slug, image });
    await sub.save();
    res.status(201).json(sub);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.body.name) {
      updateData.slug = slugify(req.body.name, { lower: true, strict: true });
    }
    
    if (req.file) {
      updateData.image = getFilePath(req.file);
    }

    const sub = await SubCategory.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(sub);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sub-Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
