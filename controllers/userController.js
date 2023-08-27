const User = require('../Models/userModel')
const catchAsync = require('../utilities/catchAsync')
const AppError = require('../utilities/appError')

exports.getAllUsers = catchAsync(async(req, res) => {
  const allUsers = await User.find()
  res.status(200).json({
    status: 'success',
    numbers: allUsers.length,
    data: {
      user: allUsers,
    },
  });
});

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
