const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');

router.get('/', subCategoryController.getAllSubCategories);
router.get('/category/:categoryId', subCategoryController.getByCategory);
router.post('/', subCategoryController.upload, subCategoryController.createSubCategory);
router.put('/:id', subCategoryController.upload, subCategoryController.updateSubCategory);
router.delete('/:id', subCategoryController.deleteSubCategory);

module.exports = router;
