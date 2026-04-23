const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

router.get('/', mediaController.getAllMedia);
router.get('/:id', mediaController.getMediaById);
router.post('/', mediaController.upload, mediaController.createMedia);
router.put('/:id', mediaController.upload, mediaController.updateMedia);
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;
