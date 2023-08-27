const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController')


router
  .get('/topFiveCheap', productController.topFiveCheap, productController.getAllProducts)
router
  .route('/stats')
  .get(productController.stats)
router
  .route('/peryear/:year')
  .get(productController.perYear)
router
  .route('/')
  .get(authController.protect, productController.getAllProducts)
  .post(productController.addProduct);
router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(authController.protect,authController.checkRole('admin','editor'),productController.deleteProduct)
module.exports = router;
