const SubCategory = require('../models/SubCategory');
const slugify = require('slugify');

// Create SubCategory
exports.createSubCategory = async (req, res) => {
  try {
    const { name, category, description, isActive } = req.body;
    const slug = slugify(name, { lower: true });
    
    const subCategory = new SubCategory({
      name,
      slug,
      category,
      description,
      isActive
    });
    
    await subCategory.save();
    res.status(201).json(subCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All (Populated)
exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate('category', 'name');
    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateSubCategory = async (req, res) => {
  try {
    if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true });
    
    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(subCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get by Parent Category
exports.getByCategory = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ category: req.params.categoryId });
    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'SubCategory deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
