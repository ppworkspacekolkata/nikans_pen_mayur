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
      folder: 'nikan_products',
      allowedFormats: ['jpg', 'png', 'jpeg', 'webp', 'mp4'],
    },
  });
} else {
  // Fallback to /tmp for Vercel, or local uploads folder for dev
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isProd = process.env.NODE_ENV === 'production';
      const uploadPath = path.join(isProd ? '/tmp' : __dirname, isProd ? '' : '..', 'uploads', 'products');
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
}

exports.upload = multer({ storage }).fields([
  { name: 'images', maxCount: 10 },
  { name: 'packagingImages', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]);

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category')
      .populate('subCategory')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category')
      .populate('subCategory');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFilePath = (f) => f.path.startsWith('http') ? f.path : `/uploads/products/${f.filename}`;

exports.createProduct = async (req, res) => {
  try {
    const files = req.files || {};
    const imagesPaths = files.images ? files.images.map(getFilePath) : [];
    const pkgPaths = files.packagingImages ? files.packagingImages.map(getFilePath) : [];
    const videoPaths = files.videos ? files.videos.map(getFilePath) : [];

    const mainImage = imagesPaths[req.body.mainImageIdx || 0] || (imagesPaths.length > 0 ? imagesPaths[0] : null);

    const productData = {
      ...req.body,
      slug: slugify(req.body.name, { lower: true, strict: true }),
      mainImage,
      images: imagesPaths,
      packagingImages: pkgPaths,
      videos: videoPaths
    };

    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const files = req.files;
    
    // Existing paths sent as JSON strings from frontend
    let existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    let existingPkgImages = req.body.existingPackagingImages ? JSON.parse(req.body.existingPackagingImages) : [];
    let existingVideos = req.body.existingVideos ? JSON.parse(req.body.existingVideos) : [];

    // New paths
    const newImages = files.images ? files.images.map(getFilePath) : [];
    const newPkg = files.packagingImages ? files.packagingImages.map(getFilePath) : [];
    const newVideos = files.videos ? files.videos.map(getFilePath) : [];

    // Merge
    const allImages = [...existingImages, ...newImages];
    const allPkg = [...existingPkgImages, ...newPkg];
    const allVids = [...existingVideos, ...newVideos];

    const mainImage = allImages[req.body.mainImageIdx || 0] || (allImages.length > 0 ? allImages[0] : null);

    const updateData = {
      ...req.body,
      mainImage,
      images: allImages,
      packagingImages: allPkg,
      videos: allVids
    };

    if (req.body.name) {
      updateData.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const allFiles = [product.mainImage, ...product.images, ...product.packagingImages, ...product.videos];
    allFiles.forEach(f => {
      if (f) {
        const fullPath = path.join(__dirname, '..', f);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product and associated files deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
