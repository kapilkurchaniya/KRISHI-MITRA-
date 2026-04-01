const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:String,
    email : {
        type:String,
        unique:[true,"Email already exists"]
        },
        password:String
})
const UserModel = mongoose.model('rewise class',UserSchema);

module.exports = UserModel;