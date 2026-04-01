const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username : {
        type:String,
        required:[true,"username is required"],
        unique:[true,"username already exists"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email already exists"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        select :false
    },
    bio:String,
profileimg:{
        type:String,
        default:""
    }
})

const userModel = mongoose.model("userdata",userSchema);

module.exports = userModel;   