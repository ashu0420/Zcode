const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        problem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
