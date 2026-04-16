const express = require('express');
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const bcrypt = require('bcryptjs');


const router = express.Router();


router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const existingUserName = await User.findOne({ username });
        const existingUserEmail = await User.findOne({ email });
        if (existingUserName || existingUserEmail) {
            return res.status(400).json({ message: "User exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json({ message: "User created" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
    // res.send("register is working");
});

router.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;
        // console.log("come up to here");
        if (!username || !password) {
            return res.status(400).json({ message: "All fields required" });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;