const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.get('/', videoController.getAllVideos);
router.get('/signature', videoController.getCloudinarySignature);
router.post('/', videoController.upload, videoController.createVideo);
router.put('/:id', videoController.upload, videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;
