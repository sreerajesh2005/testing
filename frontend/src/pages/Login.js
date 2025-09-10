import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

export default function Login({ embedded }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:9000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ After login, redirect to home
      nav("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`login-page ${
        embedded ? "" : "d-flex justify-content-center align-items-center"
      }`}
    >
      <div className={embedded ? "" : "col-md-5"}>
        <div className={`card shadow p-4 ${embedded ? "" : ""}`}>
          {!embedded && <h3 className="text-center mb-3">Login</h3>}

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={submit}>
            <input
              className="form-control mb-3"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              className="form-control mb-3"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>

          {!embedded && (
            <p className="text-center mt-3 mb-0">
              Don’t have an account?{" "}
              <Link to="/register" className="text-primary">
                Register
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
