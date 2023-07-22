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

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: 'here are all the users',
    },
  });
};

exports.addUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      user: 'the new user added',
    },
  });
};

exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: 'the data of the user',
    },
  });
};

exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: 'the user updated',
    },
  });
};

exports.deleteUser = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
