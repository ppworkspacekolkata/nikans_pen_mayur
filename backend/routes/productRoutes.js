const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createProduct, getAllProducts, deleteProduct, getProductBySlug } = require('../controllers/productController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});

const upload = multer({ storage: storage });

// Multi-field Upload Config
router.post('/', upload.fields([
  { name: 'images', maxCount: 10 },           // Picture of Product
  { name: 'packagingImages', maxCount: 10 },  // PACKAGING PICTURE
  { name: 'videos', maxCount: 5 }
]), createProduct);

router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);
router.delete('/:id', deleteProduct);

module.exports = router;
