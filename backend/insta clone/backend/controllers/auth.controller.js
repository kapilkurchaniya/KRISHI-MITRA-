const userModel = require('../models/user.models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function registercontroller(req, res) {
    const {username, email, password ,bio, profileimg } = req.body;

    const isuseralreayexists = await userModel.findOne({ 
        $or: [
        {email: email}
        ,{username: username}
    ]
    });
    if(isuseralreayexists){
        return res.status(400).json({
            message:"user already exists" + (isuseralreayexists.email == email ? "Email already exists" : "Username already exists")
        });
    }
        const hash = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username,
            email,
            password: hash,
            bio,
            profileimg
        });
        
        const token = jwt.sign({id:user._id , username:user.username }, process.env.JWT_SECRET , {expiresIn:"1d"});
        res.cookie("token",token)

        res.status(201).json({
            message:"user created successfully", 
            user:{
            id:user._id,
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileimg:user.profileimg
        }
        });
};


async function logincontroller(req, res) {
    const {username, email, password} = req.body;
const user= await userModel.findOne({
    $or:[
        {email:email},
        {username:username}
    ]
}).select("+password");

if(!user){
    return res.status(400).json({
        message:"user not found"
    });
}
const passcheck= await bcrypt.compare(password, user.password);

if(!passcheck){
    return res.status(400).json({
        message:"invalid password"
    });
}
const token = jwt.sign({id:user._id, username:user.username}, process.env.JWT_SECRET , {expiresIn: "1d"});
res.cookie("token",token)
res.status(200).json({
    message:"login successful",
    user:{
        id:user._id,
        username:user.username,
        email:user.email,
        bio:user.bio,
        profileimg:user.profileimg
    }
});
};

async function getMeController(req,res){
    const user = await userModel.findById(req.user.id);
    if(!user){
        return res.status(404).json({
            message:"user not found"
        });
    }
    res.status(200).json({
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileimg:user.profileimg
        }
    });
}
module.exports = {registercontroller, logincontroller , getMeController };