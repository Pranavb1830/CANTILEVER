import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import '../styles/auth.css';
import API from "../api/api";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await API.post("/auth/login", form);
      if (response.data.token) {
        login({
          token: response.data.token,
          userId: response.data.userId,
          username: response.data.username,
          profilePhoto: response.data.profilePhoto
        });
        navigate("/");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred during login.");
    }
  };

  return (
    <div className="auth-container login-form">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;