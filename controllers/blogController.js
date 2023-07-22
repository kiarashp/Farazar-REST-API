exports.checkId = (req, res, next, val) => {
  console.log(`this is the id ${val} that you sent`);
  if (!req.params.id) {
    return res.status(404).json({
      status: 'fail',
      message: 'bad id number',
    });
  }
  next();
};

exports.getAllBlogs = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      blog: 'here are all the blogs',
    },
  });
};

exports.addBlog = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      blog: 'the new blog added',
    },
  });
};

exports.getBlog = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      blog: 'the data of the blog',
    },
  });
};

exports.updateBlog = (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({
      status: 'fail',
      message: 'bad id number',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      blog: 'the Blog updated',
    },
  });
};

exports.deleteBlog = (req, res) => {
  res.status(204).json({
    status: 'success',
    message: 'blog deleted',
    data: null,
  });
};
