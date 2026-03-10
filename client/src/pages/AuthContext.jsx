import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userId, setUserId] = useState(localStorage.getItem("userId"));
    const [user, setUser] = useState(localStorage.getItem("user"));
    return (<AuthContext.Provider value={{ token, setToken, userId, setUserId ,user,setUser}}>
        {children}
    </AuthContext.Provider>);
}

export const useAuth = () => useContext(AuthContext);