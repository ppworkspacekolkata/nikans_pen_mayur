const Product = require('../models/Product');
const slugify = require('slugify');

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { 
      name, skuCode, category, subCategory, description, 
      material, tip, ink, primaryPack, middlePacking, 
      masterCarton, cbm, mainImageIdx 
    } = req.body;

    const files = req.files;
    
    if (!files || !files.images || files.images.length === 0) {
      return res.status(400).json({ message: "Product Picture is compulsory!" });
    }
    if (!files.packagingImages || files.packagingImages.length === 0) {
      return res.status(400).json({ message: "Packaging Picture is compulsory!" });
    }

    const images = files.images.map(file => `/uploads/${file.filename}`);
    const packagingImages = files.packagingImages.map(file => `/uploads/${file.filename}`);
    const videos = files.videos ? files.videos.map(file => `/uploads/${file.filename}`) : [];

    const newProduct = new Product({
      name,
      skuCode,
      slug: slugify(name + '-' + skuCode, { lower: true }),
      category,
      subCategory,
      description,
      material,
      tip,
      ink,
      primaryPack,
      middlePacking,
      masterCarton,
      cbm,
      images,
      packagingImages,
      videos,
      mainImage: images[mainImageIdx || 0] || images[0], 
      isActive: true
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single by Slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name')
      .populate('subCategory', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product Record Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
