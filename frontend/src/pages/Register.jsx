import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "adopter", shelterName: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const field = { display: "block", width: "100%", marginBottom: 12 };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(form);
      nav(user.role === "shelter" ? "/shelter/dashboard" : "/adopter/questionnaire");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 360, margin: "3rem auto" }}>
      <h2>Create an account</h2>
      <label style={{ marginRight: 16 }}>
        <input type="radio" checked={form.role === "adopter"} onChange={() => setForm({ ...form, role: "adopter" })} /> I want to adopt
      </label>
      <label>
        <input type="radio" checked={form.role === "shelter"} onChange={() => setForm({ ...form, role: "shelter" })} /> I run a shelter
      </label>
      <input placeholder="Your name" required style={{ ...field, marginTop: 12 }} value={form.name} onChange={set("name")} />
      {form.role === "shelter" && (
        <input placeholder="Shelter name" style={field} value={form.shelterName} onChange={set("shelterName")} />
      )}
      <input type="email" placeholder="Email" required style={field} value={form.email} onChange={set("email")} />
      <input type="password" placeholder="Password (min 6 characters)" required minLength={6} style={field}
        value={form.password} onChange={set("password")} />
      <button type="submit">Sign up</button>
      <p style={{ color: "crimson" }}>{error}</p>
      <p>Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}