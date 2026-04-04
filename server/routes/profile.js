const express = require('express');
const User = require('../models/User');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');
const Message = require("../models/Message");
const router = express.Router();

router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user.userId);
    const users = await User.find({ _id: { $ne: req.user.userId } }).select("username _id");
    const submissions = await Submission.find({
        user: req.user.userId,

    }).sort({ createdAt: -1 });

    res.json({
        username: user.username,
        email: user.email,
        submissions,
        users
    })
})
router.get("/:userId", auth, async (req, res) => {
    
    const fromId = req.user.userId;
    const toId = req.params.userId;
    const messages = await Message.find({
        $or: [
            {
                from: fromId, to: toId
            },
            {
                from: toId, to: fromId
            }
        ]
    }).sort({ createdAt: 1 })
    res.json(messages);
})
module.exports = router;