const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Product = require('../models/Product');
const slugify = require('slugify');

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
    
    const category = new Category({ name, description, isActive, slug });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update Category (including status toggle)
exports.updateCategory = async (req, res) => {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name, { lower: true, strict: true });
    }
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
