const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    type: {
        type: String,
        enum: ["update", "blog", "contest", "announcement"],
        default: "blog",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    authorName: {
        type:String
    },
    tags: [String],
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);