
const mongoose = require('mongoose');

const favSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    pid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true,
    },
});
module.exports = mongoose.model("Favourite", favSchema);