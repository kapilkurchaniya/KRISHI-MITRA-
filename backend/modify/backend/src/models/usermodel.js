const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    username: {
        type : String,
        required : [true, 'Username is required'],
        unique : [true, 'Username already exists']

    },
    email: {
        type : String,  
        required : [true, 'Email is required'],
        unique : [true, 'Email already exists']
    },
    password: {
        type : String,
        required : [true, 'Password is required']
    }
})

const userModel = mongoose.model('User', userschema)
module.exports = userModel;