const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        default: "Computer Engineering",
        min: 2,
    },
    cmateria: {
        type: String,
        subtyp: "text",
        default: "",
    },
    transcontent: {
        type: String,
        subtype: "text",
        default: ""
    },
    uploaded: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

})


module.exports = mongoose.model("courses", courseSchema);