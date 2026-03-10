import { NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Navbar() {
    const { token } = useAuth();


    const linkStyle = ({ isActive }) => ({
        marginRight: "15px",
        textDecoration: "none",
        fontWeight: isActive ? "bold" : "normal",
        color: isActive ? "blue" : "black",
    });

    return (
        <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            <NavLink to="/" style={linkStyle}>
                Home
            </NavLink>
            <NavLink to="/problems" style={linkStyle}>
                Problems
            </NavLink>
            <NavLink to="/contests" style={linkStyle}>
                Contest
            </NavLink>
            {/* <NavLink to="/bookmarks" style={{ marginRight: "15px" }}>
               Bookmarks
            </NavLink>
            <NavLink to="/signup" style={{ marginRight: "15px" }}>
                Sign Up
            </NavLink> */}
            {!token ?
                <NavLink to="/auth" style={linkStyle}>
                    Sign up/Sign in
                </NavLink> :
                <NavLink to="/profile" style={linkStyle}>
                    Sign Out
                </NavLink>}

        </nav>
    );
}

export default Navbar;
