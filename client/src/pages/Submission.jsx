import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Submission() {
    const { submissionId } = useParams();
    const [solution, setSolution] = useState();
    useEffect(() => {
        const fetchSol = async () => {
            const res = await fetch(`http://localhost:5000/api/submissions/submission/${submissionId}`);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            const data = await res.json();
              
            setSolution(data);
        }
        fetchSol();
    }, [submissionId]);
    if (!solution) return <h2>Loading...</h2>;
    console.log(solution);
    return (<div>
        <p><b>ID:</b> {solution._id}</p>
        <p><b>Submitted:</b> {new Date(solution.createdAt).toLocaleString()}</p>
        <p><b>Language:</b> {solution.language}</p>
        <div>
        <h3>Code</h3>

        </div>
        <pre>{solution.code}</pre>
    </div>);
}
export default Submission;