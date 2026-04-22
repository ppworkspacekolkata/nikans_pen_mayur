const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'SubCategory name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Parent category is required']
  },
  image: String,
  description: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Ensure a unique slug within a category? Usually slugs are unique globally for SEO.
module.exports = mongoose.model('SubCategory', subCategorySchema);
