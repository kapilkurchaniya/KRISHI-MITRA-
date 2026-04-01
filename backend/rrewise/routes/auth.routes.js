const express = require('express');
const router = express.Router(); // allow us to create routes expect from app.js
const UserModel = require("../models/user.models");
const jwt = require("jsonwebtoken");//npm i jsonwebtoken
const crypto = require("crypto");

router.post("/register", async(req,res)=> { 
   const {name,email,password} = req.body;
   const isalreadyexists = await UserModel.findOne({email});
   if (isalreadyexists){
      return res.status(400).json({
        message:"email already exists"
      })
   }
const hashedpassword = crypto.createHash("md5").update(password).digest("hex");
 const user = await UserModel.create({
    name,
    email,
   password:hashedpassword
    
    // We have write name and email and password because we have to match the name of the field in the database and the name of the field in the body of the request. if we write name: name then it will work but if we write other then it will not work because it will not match the name of the field in the database. so we have to write name: name or we can write name because it will automatically match the name of the field in the database.
 })
 const token = jwt.sign({id:user._id , email:user.email},process.env.JWT_SECRET)
   res.cookie("jwt_token", token)
    res.status(201).json({  
         message: "user registered",
          user,
          token
    })
})
router.post("/protected", async(req,res)=> {
   console.log(req.cookies); // request cookies is an object that contains all the cookies that are sent by the client. we can access the cookies by using req.cookies.cookie_name
  
   res.status(200).json({
    message:"this is protected route"
   })
})
   router.post("/login", async(req,res)=>{
      const {email,password} = req.body;
      const user = await UserModel.findOne({email});
      if(!user){
         return res.status(404).json({
            message:"user not found"
         })
      }
      const ispasswordmatch = user.password === crypto.createHash("md5").update(password).digest("hex");
      if(!ispasswordmatch){
         return res.status(401).json({
            message:"invalid password"
         })
      }
      const token = jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET)
      res.cookie("user details", token)
      res.status(200).json({
         message:"user logged in",
         user,
         token
      })
   })

module.exports = router;