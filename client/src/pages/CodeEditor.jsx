import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useAuth } from "./AuthContext";


function CodeEditor({ testCases, problemId }) {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("cpp");
    const [output, setOutput] = useState("");
    const { token } = useAuth();
    // const token = localStorage.getItem("token");

    const starterCode = {
        javascript: `const fs = require("fs");\nconst input = fs.readFileSync(0,"utf8");\nconsole.log(input);`,
        cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    return 0;\n}`,
        python: `import sys\nprint(sys.stdin.read())`,
    };

    useEffect(() => {
        setCode(starterCode[language]);
    }, [language]);

    const runCode = async () => {
        if (token) {
            const res = await fetch("http://localhost:5000/api/execute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    problemId,
                    language,
                    code,
                    testCases,

                }),
            });

            const data = await res.json();
            setOutput(data.verdict);
        }
        else setOutput("Need Sign In");
    };

    return (
        <div>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
            </select>
            <br />
            <Editor
                height="400px"
                language={language === "cpp" ? "cpp" : language}
                value={code}
                theme="vs-dark"
                onChange={(value) => setCode(value)}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    automaticLayout: true,
                }}
            />
            <br />
            <button onClick={runCode}>Submit</button>

            {output && <pre>{output}</pre>}
        </div>
    );
}

export default CodeEditor;
