const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/auth");
const PORT = 5000;
const problemsRoutes = require("./routes/problems");
const executeRoutes = require("./routes/execute");
const submissionRoutes = require("./routes/submissions");


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        return console.log("DB IS CONNECTED")
    }).catch((err) => console.log(err));
// app.use((req, res, next) => {
//     console.log(req.method, req.url);
//     next(); 
// });
// app.get("/api/test", (req, res) => {
//     console.log("API HIT");
//     res.json({ ok: true });
// });
// app.get("/", (req, res) => {
//     res.send("Api running");
// });
app.use("/api/problems", problemsRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
    console.log("Server is running");
});