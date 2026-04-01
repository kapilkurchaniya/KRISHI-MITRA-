const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    
    caption: {
        type: String,
         default: ""
    },
    imgurl: {
        type: String,
        required: [true, "Image is required"]
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "userdata",
        required: [true, "User is required"]
    }
});
const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;