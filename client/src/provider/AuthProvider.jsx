import AuthContext from "../context/authContext";
import { useState, useMemo } from "react";


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = window.localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState(() => window.localStorage.getItem("token"));

    const login = (userData, tokenData) => {
        setUser(userData);
        setToken(tokenData);
        window.localStorage.setItem("user", JSON.stringify(userData));
        window.localStorage.setItem("token", tokenData);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("token");
    }

    const register = (userData, tokenData) => {
        setUser(userData);
        setToken(tokenData);
        window.localStorage.setItem("user", JSON.stringify(userData));
        window.localStorage.setItem("token", tokenData);
    }

    const value = useMemo(() => ({
        user,
        token,
        login,
        logout,
        register
    }), [user, token]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;