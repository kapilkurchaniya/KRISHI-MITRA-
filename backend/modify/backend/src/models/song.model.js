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
                "happy",
                "sad",
                "surprised",
                 "neutral"
            ],
            message: "Invalid mood"
        }
    }
})

const Songmodel = mongoose.model("song", songSchema)

module.exports = Songmodel