const Media = require('../models/Media');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/media/';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

exports.upload = multer({ storage }).fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'galleryFiles', maxCount: 50 }
]);

exports.getAllMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMedia = async (req, res) => {
  try {
    const files = req.files;
    const thumbnailPath = files.thumbnail ? `/uploads/media/${files.thumbnail[0].filename}` : null;
    
    const galleryFiles = files.galleryFiles || [];
    const gallery = galleryFiles.map(f => ({
      url: `/uploads/media/${f.filename}`,
      fileType: f.mimetype.startsWith('video') ? 'video' : 'image',
      caption: ''
    }));

    const mediaData = {
      ...req.body,
      thumbnail: thumbnailPath,
      gallery: gallery
    };

    const media = new Media(mediaData);
    await media.save();
    res.status(201).json(media);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.updateMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });

    const files = req.files;
    let thumbnail = media.thumbnail;
    if (files.thumbnail) {
      thumbnail = `/uploads/media/${files.thumbnail[0].filename}`;
    }

    let gallery = req.body.existingGallery ? JSON.parse(req.body.existingGallery) : media.gallery;
    
    const newGalleryFiles = files.galleryFiles || [];
    const newItems = newGalleryFiles.map(f => ({
      url: `/uploads/media/${f.filename}`,
      fileType: f.mimetype.startsWith('video') ? 'video' : 'image',
      caption: ''
    }));

    const updateData = {
      ...req.body,
      thumbnail,
      gallery: [...gallery, ...newItems]
    };

    const updated = await Media.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });

    // Delete files from disk
    const filesToDelete = [media.thumbnail, ...media.gallery.map(g => g.url)];
    filesToDelete.forEach(f => {
      if (f) {
        const fullPath = path.join(__dirname, '..', f);
        if (fs.existsSync(fullPath)) {
          try { fs.unlinkSync(fullPath); } catch(e) { console.error(e); }
        }
      }
    });

    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: 'Media deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
