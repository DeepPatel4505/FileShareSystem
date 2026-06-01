import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = window.sessionStorage.getItem("username");
    const storedEmail = window.sessionStorage.getItem("email");
    const storedPassword = window.sessionStorage.getItem("password");

    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
    if (storedPassword) setPassword(storedPassword);

    return () => {
      window.sessionStorage.removeItem("username");
      window.sessionStorage.removeItem("email");
      window.sessionStorage.removeItem("password");
    };
  }, []);

  const handleValueChange = (e, stateModifier) => {
    const { name, value } = e.target;
    window.sessionStorage.setItem(name, value);
    stateModifier(value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      register(response.data, response.data.token);
      navigate("/files");
    } catch (registerError) {
      const message =
        registerError?.response?.data?.message ||
        registerError?.response?.data ||
        "Registration failed";

      setError(message);
    }
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center p-6">
      <div className="login-card w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Create your account</h1>
        <form className="login-form flex flex-col gap-4" onSubmit={handleRegister}>
          <div className="flex flex-col gap-2">
            <label htmlFor="username">Username</label>
            <input
              className="input-field"
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => handleValueChange(e, setUsername)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              className="input-field"
              type="email"
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

          {error && <p className="text-sm text-(--destructive)">{error}</p>}

          <button className="btn-primary" type="submit">
            Register
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;