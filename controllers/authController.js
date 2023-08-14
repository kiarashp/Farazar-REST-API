const User = require('../Models/userModel')
const catchAsync = require('../utilities/catchAsync')


exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    })

})