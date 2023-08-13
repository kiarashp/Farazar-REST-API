const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'you must add a name']
    },
    email:{
        type: String,
        required: [true, 'please provide an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,'you need to add a correct email']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'you need to add a password'],
        minlengh:[8,'your password must have at least 8 characters']
    },
    passwordConfirm:{
        type: String,
        required: [true, 'you need to add a confirmed  password'],
    }

})

const User = mongoose.model('User',userSchema)
module.exports = User