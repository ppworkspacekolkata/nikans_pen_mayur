const VideoPost = require('../models/VideoPost');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Storage Configuration
let storage;
if (process.env.CLOUDINARY_CLOUD_NAME) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'nikan_videos',
      allowedFormats: ['jpg', 'png', 'jpeg', 'webp', 'mp4'],
      resource_type: 'auto'
    },
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', 'uploads', 'videos');
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
}

exports.upload = multer({ 
  storage,
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB limit
}).fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

const getFilePath = (f) => f.path.startsWith('http') ? f.path : `/uploads/videos/${f.filename}`;

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await VideoPost.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createVideo = async (req, res) => {
  try {
    const files = req.files || {};
    // Prioritize URL from body (direct frontend upload) over Multer file
    const videoUrl = req.body.videoUrl || (files.video ? getFilePath(files.video[0]) : null);
    const thumbnail = req.body.thumbnail || (files.thumbnail ? getFilePath(files.thumbnail[0]) : null);

    if (!videoUrl) return res.status(400).json({ message: 'Video file is required' });

    const videoData = {
      ...req.body,
      videoUrl,
      thumbnail
    };

    const video = new VideoPost(videoData);
    await video.save();
    res.status(201).json(video);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const video = await VideoPost.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const files = req.files || {};
    let videoUrl = req.body.videoUrl || video.videoUrl;
    let thumbnail = req.body.thumbnail || video.thumbnail;

    if (files.video) videoUrl = getFilePath(files.video[0]);
    if (files.thumbnail) thumbnail = getFilePath(files.thumbnail[0]);

    const updateData = {
      ...req.body,
      videoUrl,
      thumbnail
    };

    const updated = await VideoPost.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await VideoPost.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    // Note: In production, you'd also delete files from Cloudinary/Disk here
    await VideoPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCloudinarySignature = (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: 'nikan_videos' },
      process.env.CLOUDINARY_API_SECRET
    );
    res.json({
      signature,
      timestamp,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
