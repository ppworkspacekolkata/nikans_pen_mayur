const mongoose = require('mongoose');

const heroSettingsSchema = new mongoose.Schema({
  title: { type: String, default: 'Mastering the Art of' },
  subtitle: { type: String, default: 'Precision Writing' },
  description: { type: String, default: 'NIKAN, a global-facing brand of Tirupati Colour Pens Pvt. Ltd...' },
  
  // 3 Stats
  stats: [
    { label: { type: String, default: 'Global Markets' }, value: { type: String, default: '20' } },
    { label: { type: String, default: 'Precision SKUs' }, value: { type: String, default: '100' } },
    { label: { type: String, default: 'Years Active' }, value: { type: String, default: '15' } }
  ],

  // Multiple Images for the Right Slider
  images: [{ type: String }],
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('HeroSettings', heroSettingsSchema);
