import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form.email, form.password);
      nav(user.role === "shelter" ? "/shelter/dashboard" : "/matches");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 360, margin: "3rem auto" }}>
      <h2>Log in</h2>
      <input type="email" placeholder="Email" required style={{ display: "block", width: "100%", marginBottom: 12 }}
        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" required style={{ display: "block", width: "100%", marginBottom: 12 }}
        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Log in</button>
      <p style={{ color: "crimson" }}>{error}</p>
      <p>New here? <Link to="/register">Create an account</Link></p>
    </form>
  );
}