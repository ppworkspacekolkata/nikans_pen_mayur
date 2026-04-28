const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Product = require('../models/Product');
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
      folder: 'nikan_categories',
      allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
    },
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isProd = process.env.NODE_ENV === 'production';
      const uploadPath = path.join(isProd ? '/tmp' : __dirname, isProd ? '' : '..', 'uploads', 'categories');
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
}

exports.upload = multer({ storage }).single('image');

const getFilePath = (f) => f.path.startsWith('http') ? f.path : `/uploads/categories/${f.filename}`;

// Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    
    let image = '';
    if (req.file) {
      image = getFilePath(req.file);
    }

    const category = new Category({ name, description, isActive, slug, image });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update Category (including status toggle)
exports.updateCategory = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.body.name) {
      updateData.slug = slugify(req.body.name, { lower: true, strict: true });
    }
    
    if (req.file) {
      updateData.image = getFilePath(req.file);
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Category (Careful: Should we delete sub-cats too?)
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    // Optional: Clean up associated sub-categories
    await SubCategory.deleteMany({ category: req.params.id });
    res.json({ message: 'Category and its sub-categories deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
