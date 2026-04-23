const SubCategory = require('../models/SubCategory');
const slugify = require('slugify');

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
    
    const sub = new SubCategory({ name, description, category, isActive, slug });
    await sub.save();
    res.status(201).json(sub);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name, { lower: true, strict: true });
    }
    const sub = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
