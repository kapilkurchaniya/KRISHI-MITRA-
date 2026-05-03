const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    posterUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    mood:{
        type: String,
        enum:{
            values:[
                "happy", "sad", "angry", "fear", "surprise", 
                "disgust", "contempt", "neutral"
            ],
            message: "Invalid mood - must be one of: happy,sad,angry,fear,surprise,disgust,contempt,neutral"
        }
    }
})

const Songmodel = mongoose.model("song", songSchema)

module.exports = Songmodel