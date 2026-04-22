const Category = require('../models/Category');
const slugify = require('slugify');

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const slug = slugify(name, { lower: true });
    const category = new Category({ name, slug, description, isActive });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (name) req.body.slug = slugify(name, { lower: true });
    
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
