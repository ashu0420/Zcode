
import { useOutletContext} from "react-router-dom";

function Description() {
    const { problem } = useOutletContext();

    return (
        <div>
            <h2>{problem.title}</h2>
            <p>{problem.description}</p>

            <h3>Test cases</h3>
            {/* <h3>Input</h3>
            <pre>{problem.input}</pre>
            
            <h3>Expected Output</h3>
            <pre>{problem.output}</pre> */}

            <ul>
                {problem.testCases.map((tc, index) => (
                    <li key={index}>
                        <b>Input:</b> {tc.input}
                        <br />
                        <b>Output:</b> {tc.output}
                    </li>
                ))}
            </ul>
        </div>)
}
export default Description;