const crypto = require('crypto')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../Models/userModel')
const catchAsync = require('../utilities/catchAsync')
const AppError = require('../utilities/appError')
const sendEmail = require('../utilities/email')

// generate a token based on the user id
const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: '90d'
    })
}
const  createSendToken = (user,statusCode,res)=>{
    const token = signToken(user._id)
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}


exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })
    createSendToken(newUser,201,res)
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    //email and password should not be empty
    if (!email || !password) {
        return next(new AppError('you need to add email and password for loggin in...'), 400)
    }
    //check to see if email and pass match
    const user = await User.findOne({ email }).select('+password')//we need mongoose to add hidden field
    if (!user || !(await user.comparePasses(password, user.password))) {
        return next(new AppError('email or password did not match', 401))
    }
    // Logging in successfully
    createSendToken(user,200,res)
})

exports.protect = catchAsync(async (req, res, next) => {
    //get the token and see if it exists
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new AppError('You need to login in order to proceed', 401))
    }
    //verification of the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    //checking if the logged in user id, still exist and it did not get deleted
    const loginUser = await User.findById(decoded.id)
    if (!loginUser) {
        return next(new AppError('There is no user with this token in our database', 401))
    }
    //check if the user changed password after the jwt
    if (loginUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('You have changed your password recently. Login again.', 401))
    }
    // If everything's fine, the access shall granted
    req.user = loginUser
    next()

})
exports.checkRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have the permission to perform this action!!!', 403))
        }
        next()
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new AppError('There is no user with this email', 404))
    }
    // Generate the random reset Token
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })
    // Send it to user's email
    const resetURl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`
    const message = `you forgot your pass. that is ok. click here: ${resetURl}.\nif you did not ask for changing your pass just ignor this`
    try {
        await sendEmail({
            email: user.email,
            subject: 'you asked for changing password (valid for 10 minutes)',
            message
        })
        res.status(200).json({
            status: 'success',
            message: 'Token sent to the email'
        })
    }
    catch (err) {
        user.passwordResetToken = undefined,
            user.passwordResetExpires = undefined,
            await user.save({ validateBeforeSave: false })

        return next(new AppError('There was an error sending email'), 500)

    }
})
exports.resetPassword = catchAsync(async (req, res, next) => {
    // get the user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })
    //if the token did not expired and user still existed , set the new password
    if (!user) {
        return next(new AppError('TOken is invalid or expired', 400))
    }
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    //update changedPasswordAt property for the user

    //log the user in, sent JWT
    createSendToken(user,200,res)
    next()
})
exports.updatePassword = catchAsync(async (req,res,next)=>{
    // get user from database
    const user = await User.findById(req.user.id).select('+password')
    // check if old password is correct
    if(!(await user.comparePasses(req.body.oldpassword,user.password))){
        return next(new AppError('your old password is wrong',401))
    }

    //update the new password
     user.password = req.body.newpassword
     user.passwordConfirm = req.body.passwordConfirm
     await user.save()
    //log user in and generate JWT
    createSendToken(user,200,res)
})