const followModel = require("../models/folllow.model");
const userModel = require("../models/user.models");

async function followcontroller(req, res) {
   const followername = req.user.username;
   const followeeusername = req.params.username;

    if (followername === followeeusername) {
        return res.status(400).json({
            message: "you cannot follow yourself"
        });
    }
    const isfolloweeexists = await userModel.findOne({
        username: followeeusername
    });
    if (!isfolloweeexists) {
        return res.status(404).json({
            message: "user not found"
        });
    }
    const isalreadyfollowing = await followModel.findOne({
        follower: followername,
        followee: followeeusername
    });
    if (isalreadyfollowing) {
        return res.status(200).json({
            message: `you are already following ${followeeusername}`
        });
    }

       const followrecord = await followModel.create({
        follower: followername,
        followee: followeeusername
    });
      
    res.status(201).json({
        message: `You are now following ${followeeusername}`,
        followingrecord: followrecord
    });
}

async function unfollowcontroller(req, res) {
    const followername = req.user.username;
    const followeeusername = req.params.username;

    const isfolloweeexists = await userModel.findOne({
        username: followeeusername
    });
    if (!isfolloweeexists) {
        return res.status(404).json({
            message: "user not found"
        });
    }
const isfollowing = await followModel.findOne({
    follower: followername,
    followee: followeeusername
});
if (!isfollowing) {
    return res.status(400).json({
        message: `you are not following ${followeeusername}`
    });
}
await followModel.findByIdAndDelete(isfollowing._id);
res.status(200).json({
    message: `You have unfollowed ${followeeusername}`
});
}

module.exports = { followcontroller, unfollowcontroller };