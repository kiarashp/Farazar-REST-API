const express = require('express');

const router = express.Router();
const productController = require('../controllers/productController');

// router.param('id', productController.checkId);
router.get('/topFiveCheap',productController.topFiveCheap,productController.getAllProducts)
router.route('/stats').get(productController.stats)
router.route('/peryear/:year').get(productController.perYear)
router.route('/').get(productController.getAllProducts).post(productController.addProduct);
router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
