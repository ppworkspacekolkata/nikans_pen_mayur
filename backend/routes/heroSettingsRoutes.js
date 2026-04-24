const express = require('express');
const router = express.Router();
const heroSettingsController = require('../controllers/heroSettingsController');

const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', heroSettingsController.getSettings);
router.post('/update', heroSettingsController.upload, heroSettingsController.updateSettings);
router.post('/remove-image', heroSettingsController.removeImage);

module.exports = router;
