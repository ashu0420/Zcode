const express = require('express');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');

const router = express.Router();




router.get("/submission/:submissionId", async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.submissionId);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        res.json(submission);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get("/:problemId", async (req, res) => {
    const submissions = await Submission.find({
        problem: req.params.problemId,
    }).populate("problem", "title") // 👈 fetch slug here
        .sort({ createdAt: -1 });
    res.json(submissions);
})
router.get("/:problemId/:userId", async (req, res) => {
    // console.log("api");
    const submissions = await Submission.find({
        user: req.params.userId,
        problem: req.params.problemId,
    }).populate("problem", "title") // 👈 fetch slug here
        .sort({ createdAt: -1 });
    res.json(submissions);
})

module.exports = router;