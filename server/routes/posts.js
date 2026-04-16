const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        // console.log(posts);
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" }); // ✅ always JSON
    }
});
// CREATE post
router.post("/", auth, async (req, res) => {
    // console.log(req);
    const post = await Post.create({
        ...req.body,
        
        author: req.user.userId,
        authorName:req.user.username

    });
    res.json(post);
});


module.exports = router;