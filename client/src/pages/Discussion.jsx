import { useState ,useEffect} from "react";
import { useAuth } from "./AuthContext";
import { useOutletContext, useNavigate } from "react-router-dom"
function Discussion() {

    const {  token } = useAuth();
    const { problem } = useOutletContext();
    const [chat, setChat] = useState("");
    const [post, setPost] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetch(`http://localhost:5000/api/problems/${problem._id}/discussion`)
            .then(res => res.json())
            .then(setPost);
    }, [problem._id]);
    const sendChat = async () => {
        if (!token) return navigate("/auth/signin");
        const res = await fetch(`http://localhost:5000/api/problems/${problem._id}/discussion`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                content:chat
            })
        });
        const data = await res.json();
        setPost(prev => [data, ...prev]);
        setChat("");

    }
    return <div>Discussion
        <textarea name="" id="" value={chat} onChange={(e) => { setChat(e.target.value) }} placeholder="Type here"></textarea>
        <button onClick={sendChat}>{token ? "Send" : "Login"}</button>

        <ul>
            {
                post.map((p) => {
                   return <li key={p._id}>

                        <b>{p.user.username}</b>
                        <p> {p.content}</p>
                        <small> {new Date(p.createdAt).toDateString()}</small>
                    </li>
                })
            }
        </ul>
    </div>
}
export default Discussion;