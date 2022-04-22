const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    event_title: {
        type: String,
        required: true,
        unique: true
    },
    event_subtext: {
        type: String,
        required: true
    },
    event_image_thumb: {
        type: String,
        required: true
    },
    event_image_banner: {
        type: String,
        required: true
    },
    event_dates: {
        type: String,
        required: true
    },
    event_category: {
        type: String,
        required: true
    },
    event_detail_text: {
        type: String,
        required: true
    },
    event_fee: {
        type: String,
        required: true
    },
    event_apply_new_url: {
        type: String,
        required: true
    },
    event_isFeatured:{
        type: Number,
        //required: true,
        enum: [0, 1]
    }
})

module.exports = mongoose.model("Event", eventSchema)



