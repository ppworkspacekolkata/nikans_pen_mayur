const mongoose = require('mongoose');

const heroSliderSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String },
  subtitle: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('HeroSlider', heroSliderSchema);
