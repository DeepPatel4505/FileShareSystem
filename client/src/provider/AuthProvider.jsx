import AuthContext from "../context/authContext";
import { useState, useMemo, useEffect } from "react";


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedUser = window.localStorage.getItem("user");
        const storedToken = window.localStorage.getItem("token");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

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