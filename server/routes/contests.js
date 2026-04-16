
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    const username = 'shraman1507'; const apiKey = '738ba004d8e3e434774b366ec26692422912b96f';
    try {
        const response = await fetch(
            `https://clist.by/api/v2/contest/?username=${username}&api_key=${apiKey}&upcoming=true&limit=20`
        );

        const data = await response.json();

        res.json(data.objects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;