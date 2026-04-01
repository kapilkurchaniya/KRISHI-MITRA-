const express = require("express");
const userrouter = express.Router();
const usercontroller = require("../controllers/user.controller");
const userverify = require("../middleware/auth.middleware");

userrouter.post("/follow/:username", userverify, usercontroller.followcontroller);
userrouter.post("/unfollow/:username", userverify, usercontroller.unfollowcontroller);
// userrouter.get("/followers", userverify, usercontroller.getfollowerscontroller);
// userrouter.get("/following", userverify, usercontroller.getfollowingcontroller);

module.exports = userrouter;