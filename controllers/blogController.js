const Blog = require('../Models/blog');

exports.getAllBlogs = async (req, res) => {
  try {
    const query = {...req.query}
    console.log(query)
    const allblogs = await Blog.find();
    res.status(200).json({
      status: 'success',
      data: {
        allblogs,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.addBlog = async (req, res) => {
  try {
    const newblog = await Blog.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        newblog,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        blog,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const updatedblog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        updatedblog,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).json({
      status: 'success',
      message: 'blog deleted',
      data: null,
    });
  }
  catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }

};
