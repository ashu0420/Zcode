import { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";


import CodeEditor from "./CodeEditor";

function Problem() {
    const { slug } = useParams();
    const [problem, setProblem] = useState(null);
    const linkStyle = ({ isActive }) => ({
        marginRight: "15px",
        textDecoration: "none",
        fontWeight: isActive ? "bold" : "normal",
        color: isActive ? "blue" : "black",
    });

    useEffect(() => {
        const fetchProblem = async () => {
            const res = await fetch(
                `http://localhost:5000/api/problems/${slug}`
            );
            const data = await res.json();
            setProblem(data);
        };

        fetchProblem();
    }, [slug]);
    // console.log(problem);

    if (!problem) return <h2>Loading...</h2>;

    return (
        <div>
            <div style={{ padding: "20px" }}>
                <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    <NavLink to="" end style={linkStyle}>
                        Description
                    </NavLink>
                    <NavLink to="mySubmissions" style={linkStyle}>
                        My Submissions
                    </NavLink>
                    <NavLink to="allSubmissions" style={linkStyle}>
                        All Submissions
                    </NavLink>
                    <NavLink to="discussion" style={linkStyle}>
                        Discussion
                    </NavLink>

                </nav>
               {problem.tittle}
                <Outlet context={{problem}} />
                
               

            </div>
            <div>
                <CodeEditor testCases={problem.testCases} problemId={problem._id} />
            </div>
        </div>

    );
}

export default Problem;
