const express = require('express');
const postrouter = express.Router();
const postcontroller = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({storage: multer.memoryStorage()});
const userverify = require("../middleware/auth.middleware");



postrouter.post("/", userverify, upload.single("image"), postcontroller.createpostcontroller);

postrouter.get("/feed", userverify, postcontroller.getfeedcontroller);
postrouter.post("/like/:id", userverify, postcontroller.likepostcontroller);

postrouter.get("/", userverify, postcontroller.getpostcontroller);
postrouter.get("/:id", userverify, postcontroller.getpostdetailscontroller);

module.exports = postrouter;
    