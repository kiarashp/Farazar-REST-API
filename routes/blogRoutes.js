const express = require('express');

const router = express.Router();
const blogController = require('../controllers/blogController');

router.param('id', blogController.checkId);

router.route('/').get(blogController.getAllBlogs).post(blogController.addBlog);
router
  .route('/:id')
  .get(blogController.getBlog)
  .patch(blogController.updateBlog)
  .delete(blogController.deleteBlog);

module.exports = router;
