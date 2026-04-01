const postmodel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const likeModel = require("../models/like.model");


const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

async function createpostcontroller(req, res) {
    console.log(req.body, req.file);
    
    const token = req.cookies.token; //req m hain token cookie m store hoga
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test",
        folder: "/instaclone"
    })
    res.send(file);
    console.log(file);


    const post = await postmodel.create({
        caption: req.body.caption,
        imgurl: file.url,
        user: req.user.id
    })
    res.status(201).json({
        message: "Post created successfully", post
    });

}


async function getpostcontroller(req, res) {
   
    const userid = req.user.id;

    const post = await postmodel.findOne({
        user: userid
    })
if (!post) {
    return res.status(404).json({
        message: "post not found"
    });
}

    res.status(200).json({
        message: "user post sent succesfully",
        post
    })


}

async function getpostdetailscontroller(req, res) {
    const userid = req.user.id;
   
    const postid = req.params.id;
    const post = await postmodel.findOne({
        _id: postid,
        user: userid
    })
    if (!post) {
        return res.status(404).json({
            message: "post not found"
        });
    }
    const isvaliduser = post.user.toString() === userid;
    console.log(post.user.toString(), userid);
    
    if (!isvaliduser) {
        return res.status(403).json({
            message: "forbidden access"
        });
    }
    res.status(200).json({
        message: "post details sent successfully",
        post
    });
    
}

async function likepostcontroller(req, res) {
    const username = req.user.username;
    const postid = req.params.id;
    const post = await postmodel.findById(postid);
    if (!post) {
        return res.status(404).json({
            message: "post not found"
        });
    }
    const like = await likeModel.create({
        post: postid,
        user: username
    })

    res.status(200).json({
        message: "Post liked successfully.",
        like
    })
}

async function getfeedcontroller(req, res) {
    const post = await postmodel.find().populate("user");
    if (!post) {
        return res.status(404).json({
            message: "posts not found"
        });
    }

    res.status(201).json({
        message: "feed sent successfully",
        post
    })
}


module.exports = { createpostcontroller, getpostcontroller, getpostdetailscontroller, likepostcontroller, getfeedcontroller };