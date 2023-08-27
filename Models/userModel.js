const crypto = require('crypto')
const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'you must add a name']
    },
    email: {
        type: String,
        required: [true, 'please provide an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'you need to add a correct email']
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ['customer', 'editor', 'admin'],
        default: 'customer'
    }
    ,
    password: {
        type: String,
        required: [true, 'you need to add a password'],
        minlength: [8, 'your password must have at least 8 characters'],
        select: false //never show up on any output
    },
    passwordConfirm: {
        type: String,
        required: [true, 'you need to add a confirmed  password'],
        // Only works nad run on create and save
        validate: {
            validator: function (val) {
                return val === this.password
            },
            message: 'The password and the password confirm shoulb be the same.'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}
)
//before saving any user data , the password will hash
userSchema.pre('save', async function (next) {
    //whenever the password modified this action happens
    if (!this.isModified('password')) return next();
    //hashing password
    this.password = await bcrypt.hash(this.password, 12);
    //delet confirm password
    this.passwordConfirm = undefined
    next()
})
// updating the passwordChangedAt for the user when he or she changes his or her password
userSchema.pre('save', function (next) {
    //if the password is not updating or it is a new document(user sign up) do nothing
    if (!this.isModified('password') || this.isNew) return next()
    //sometimes saving to the database is slower than generating the jwt token.
    //in order to tackle this problem we pull pack the time of saving in the database.
    //so we will not have any problem in this step : <check if the user changed password after the jwt>
    this.passwordChangedAt = Date.now() - 5000
    next()
})
//compare the encrypted entered password with the encrypted saved password
userSchema.methods.comparePasses = async function (enteredPassword, userPassword) {
    return await bcrypt.compare(enteredPassword, userPassword)
}
//check if the jwt token generated after the passwordChangedAt. if it return false then everything is OK.
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        //compare the time when token is generated and the time password changed in seconds
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        // if it's true, the password have changed after the token generated. so token shouldn't work
        return JWTTimestamp < changedTimeStamp
    }
    return false
}

userSchema.methods.createPasswordResetToken = function () {
    //create random token
    const resetToken = crypto.randomBytes(32).toString('hex')
    //encrypt the token generated and then save it in our database
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    //register the token date and add 10 minutes in milliseconds to it
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    //return the token in plain text
    return resetToken
}
const User = mongoose.model('User', userSchema)
module.exports = User