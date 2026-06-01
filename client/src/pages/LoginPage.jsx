import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../lib/api";
import {useAuth} from "../hooks/useAuth";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await api.post("/auth/login", { email, password });
        if (response.status === 200) {
            login(response.data.username, response.data.token);
            navigate("/files");
        }else {
            setError(response.data.message || "Login failed");
            return;
        }
    };

    const handleValueChange = (e, stateModifier) => {
        const { name, value } = e.target;
        window.sessionStorage.setItem(name, value);
        stateModifier(value);
    };

    useEffect(() => {  
        const storedEmail = window.sessionStorage.getItem("email");
        const storedPassword = window.sessionStorage.getItem("password");
        if (storedEmail) {
            setEmail(storedEmail);
        }
        if (storedPassword) {
            setPassword(storedPassword);
        }
    }, []);

    useEffect(() => {
        return () => {
            window.sessionStorage.removeItem("email");
            window.sessionStorage.removeItem("password");
        };
    }, []);


    return (
        <div className="login-page min-h-screen flex items-center justify-center p-6">
            <div className="login-card w-full max-w-md">
                <h1 className="text-2xl font-semibold mb-4">Sign in to your account</h1>
                <form
                    className="login-form flex flex-col gap-4"
                    onSubmit={handleLogin}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleLogin(e);
                        }
                    }}
                >
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email">Email</label>
                        <input
                            className="input-field"
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => handleValueChange(e, setEmail)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password">Password</label>
                        <input
                            className="input-field"
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => handleValueChange(e, setPassword)}
                        />
                    </div>
                    <button className="btn-primary" type="submit">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
