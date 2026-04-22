const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  skuCode: {
    type: String,
    unique: true,
    required: [true, 'SKU Code is compulsory']
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is compulsory']
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: [true, 'SubCategory is compulsory']
  },
  description: {
    type: String,
    required: [true, 'SKU Description is compulsory']
  },
  
  // Compulsory Media
  mainImage: { type: String, required: [true, 'Product main picture is compulsory'] },
  images: [String],           // Additional gallery photos
  videos: [String],           // Optional videos
  packagingImages: [String],  // Compulsory packaging photos
  
  // Compulsory Product Specifications
  material: { type: String, required: [true, 'Material is compulsory'] },
  tip: { type: String, required: [true, 'Tip size is compulsory'] },
  ink: { type: String, required: [true, 'Ink color is compulsory'] },
  
  // Compulsory Packing Specifications
  primaryPack: { type: String, required: [true, 'Primary pack is compulsory'] },
  middlePacking: { type: String, required: [true, 'Middle packing is compulsory'] },
  masterCarton: { type: String, required: [true, 'Master carton is compulsory'] },
  cbm: { type: String, required: [true, 'CBM (cm3) is compulsory'] },

  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
