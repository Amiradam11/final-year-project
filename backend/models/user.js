const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    country: {
        type: String,
        default: "Nigeria",
        min: 3,
        max: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    fullname: {
        type: String,
        required: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    school: {
        type: String,
        default: "Nile University",
        max: 150,
        min: 2,
    },
    course: {
        type: String,
        default: "Computer Engineering",
        min: 2,
    },
    picture: {
        type: String,
        default: ""
    },
    refcount: {
        type: Number,
        default: 0,
    },
    refid: {
        type: String,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    mobile: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: "",
    },
    courses: {
        type: Array,
        default: [],
    }
})


module.exports = mongoose.model("users", userSchema)