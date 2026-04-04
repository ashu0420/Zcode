import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chat from './Chat';


export default function Profile() {
    const { setToken, setUserId ,token} = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState();

    useEffect(() => {
        if (!token) return;

        const fetchUser = async () => {
            const res = await fetch("http://localhost:5000/api/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            setUser(data);
            setSubmissions(data.submissions);
            setUsers(data.users);
        };

        fetchUser();
    }, [token]);
    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUserId(null);
        setToken(null);
        navigate("/auth/signin");
    }
    return <>
        <div>
            <h6>Username: {user?.username}</h6>
            <h6>Email: {user?.email}</h6>
            {/* {console.log(JSON.stringify(user, null, 2))} */}
        </div>
        <div>
            <h2>My Submissions</h2>
            
                        {submissions.length === 0 ? (
                            <p>No submissions yet.</p>
                        ) : (
                            <ul>
                                {submissions.map((s) => (
                                    <li key={s._id}>
                                        <Link to={`../submission/${s._id}`}>
                                            {s._id}:
                                        </Link>
                                        <b>Submitted:</b>{" "}
                                        {new Date(s.createdAt).toLocaleString()}
                                        {" — "}
                                        <b>Verdict:</b> {s.verdict}
                                    </li>
                                ))}
                            </ul>
                        )}
        </div>
        <h4>Chat</h4>
        <div style={{ position: "relative" }}>

            <button onClick={() => setOpen(!open)}>
                {selectedUser?.username || "Select User"} ▼
            </button>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        background: "#fff",
                        border: "1px solid #ccc",
                        width: "150px",
                    }}
                >
                    {users.map((u) => (
                        <p
                            key={u._id}
                            style={{ padding: "8px", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedUser(u);
                                setOpen(false);
                            }}
                        >
                            {u.username}
                        </p>
                    ))}
                    
                </div>
            )}
            {selectedUser && <Chat selectedUser={selectedUser} setSelectedUser={setSelectedUser} />}
            {/* <div> <Chat /></div> */}
            
        </div>
        <button onClick={handleSignOut}>Sign Out</button>

    </>
}