const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String, required: true },
  type: { type: String, enum: ['Gallery', 'Event', 'Factory', 'Exhibition'], default: 'Gallery' },
  // Array of photos and videos belonging to this media entry
  gallery: [
    {
      url: { type: String, required: true },
      fileType: { type: String, enum: ['image', 'video'], default: 'image' },
      caption: { type: String }
    }
  ],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Media', MediaSchema);
