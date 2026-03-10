const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true,
    },
    testCases: {
        type: Array,
        required:true,
    }
});
module.exports = mongoose.model("Problem", problemSchema);