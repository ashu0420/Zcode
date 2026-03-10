const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true,
        trim: true
    },
    password: {
        type: String,
        requied: true,
        minLength: 6
    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
},
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);