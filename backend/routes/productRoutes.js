const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/:slug', productController.getProductBySlug);
router.post('/', productController.upload, productController.createProduct);
router.put('/:id', productController.upload, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
