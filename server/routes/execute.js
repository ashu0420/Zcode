const express = require("express");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const Submission = require("../models/Submission");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
    try {
        const { language, code, testCases, problemId,slug } = req.body;
        // console.log("REQ.USER:", req.user);


        if (!language || !code) {
            return res.json({ verdict: "Language and code are required" });
        }

        if (!Array.isArray(testCases) || testCases.length === 0) {
            return res.json({ verdict: "No test case provided" });
        }

        const input = (testCases[0].input || "").trim();
        const expectedOutput = (testCases[0].output || "").trim();

        const base = `code-${Date.now()}`;
        const tmp = os.tmpdir();

        let runCmd, runArgs = [];

        // ---------- JS ----------
        if (language === "javascript") {
            const file = path.join(tmp, `${base}.js`);
            fs.writeFileSync(file, code);
            runCmd = "node";
            runArgs = [file];
        }

        // ---------- Python ----------
        else if (language === "python") {
            const file = path.join(tmp, `${base}.py`);
            fs.writeFileSync(file, code);
            runCmd = "python3";
            runArgs = [file];
        }

        // ---------- C++ ----------
        else if (language === "cpp") {
            const cppFile = path.join(tmp, `${base}.cpp`);
            const outFile = path.join(tmp, `${base}.out`);
            fs.writeFileSync(cppFile, code);

            const compile = spawn("g++", [cppFile, "-o", outFile]);
            let compileErr = "";

            compile.stderr.on("data", d => compileErr += d.toString());

            compile.on("close", (exitCode) => {
                if (exitCode !== 0) {
                    return res.json({ verdict: "Compile Error", error: compileErr });
                }
                runProgram(outFile, []);
            });
            return;
        }

        else {
            return res.json({ verdict: "Unsupported language" });
        }

        runProgram(runCmd, runArgs);

        function runProgram(cmd, args) {
            const child = spawn(cmd, args);

            let stdout = "";
            let stderr = "";
            let finished = false;

            const timer = setTimeout(() => {
                if (!finished) {
                    finished = true;
                    child.kill("SIGKILL");
                    saveAndRespond("Time Limit Exceeded");
                }
            }, 2000);

            child.stdout.on("data", d => stdout += d.toString());
            child.stderr.on("data", d => stderr += d.toString());

            if (input) child.stdin.write(input + "\n");
            child.stdin.end();

            child.on("close", () => {
                if (finished) return;
                finished = true;
                clearTimeout(timer);

                if (stderr) {
                    return saveAndRespond("Runtime Error", stderr);
                }

                if (stdout.trim() === expectedOutput) {
                    return saveAndRespond("Passed");
                }

                return saveAndRespond("Failed", {
                    expected: expectedOutput,
                    actual: stdout.trim()
                });
            });
        }

        async function saveAndRespond(verdict, extra = {}) {
            await Submission.create({
                user: req.user.userId,
                problem: problemId,
                slug,
                language,
                code,
                verdict,
            });
            // console.log(slug);
            return res.json({ verdict, ...extra });
        }

    } catch (err) {
        res.json({ verdict: "Server error", error: err.message });
    }
});

module.exports = router;
