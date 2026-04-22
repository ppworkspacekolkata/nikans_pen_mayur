const express = require('express');
const router = express.Router();
const { 
  createSubCategory, getAllSubCategories, updateSubCategory, deleteSubCategory, getByCategory 
} = require('../controllers/subCategoryController');

router.post('/', createSubCategory);
router.get('/', getAllSubCategories);
router.get('/category/:categoryId', getByCategory);
router.put('/:id', updateSubCategory);
router.delete('/:id', deleteSubCategory);

module.exports = router;
