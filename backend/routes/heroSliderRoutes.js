const express = require('express');
const router = express.Router();
const heroSliderController = require('../controllers/heroSliderController');

router.get('/', heroSliderController.getAllSliders);
router.post('/', heroSliderController.upload, heroSliderController.createSlider);
router.put('/:id', heroSliderController.upload, heroSliderController.updateSlider);
router.delete('/:id', heroSliderController.deleteSlider);

module.exports = router;
