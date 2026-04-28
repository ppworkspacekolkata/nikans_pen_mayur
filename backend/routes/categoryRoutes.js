const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.upload, categoryController.createCategory);
router.put('/:id', categoryController.upload, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
