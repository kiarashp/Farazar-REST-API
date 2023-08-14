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
    password: {
        type: String,
        required: [true, 'you need to add a password'],
        minlength: [8, 'your password must have at least 8 characters']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'you need to add a confirmed  password'],
        // run on create and save
        validate: {
            validator: function (val) {
                return val === this.password
            },
            message: 'The password and the password confirm shoulb be the same.'
        }
    }
})
//before saving any user data , the password will hash
userSchema.pre('save',  async function(next){
    if(!this.isModified('password')) return next();
    this.password =  await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined
    next()
})
const User = mongoose.model('User', userSchema)
module.exports = User