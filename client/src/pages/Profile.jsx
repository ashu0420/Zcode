import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";


export default function Profile() {
    const { setToken ,setUserId} = useAuth();
    const navigate = useNavigate();
    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUserId(null);
        setToken(null);
        navigate("/auth/signin");
    }
    return <div>
        <button onClick={handleSignOut}>Sign Out</button>
    </div>
}