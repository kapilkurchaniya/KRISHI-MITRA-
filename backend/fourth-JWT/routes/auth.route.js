const express = require('express');
const router = express.Router(); // allow us to create routes expect from app.js
const Usermodel = require("../models/user.models");
const jwt = require("jsonwebtoken");

router.post("/register", async(req,res)=> { 
   const {name,email,password} = req.body;
   const isalreadyexists = await Usermodel.findOne({email});
   if (isalreadyexists){
      return res.status(400).json({
        message:"email already exists"
      })
   }
 const user = await Usermodel.create({
    name,
    email,
    password
    //we have write name and email and password because we have to match the name of the field in the database and the name of the field in the body of the request. if we write name: name then it will work but if we write other then it will not work because it will not match the name of the field in the database. so we have to write name: name or we can write name because it will automatically match the name of the field in the database.
 })
 const token = jwt.sign({id:user._id , email:user._email},process.env.JWT_SECRET)
   res.cookie("jwt_token", token)
    res.status(201).json({  
         message: "user registered",
          user,
          token
    })
})
module.exports = router;
