import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ embedded }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      setError("Mobile number must be exactly 10 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:9000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // ✅ After register, go to login page
      nav("/login");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`register-page ${
        embedded ? "" : "d-flex justify-content-center align-items-center"
      }`}
    >
      <div className={embedded ? "" : "col-md-6"}>
        <div className="card p-4 shadow-sm">
          {!embedded && <h4 className="text-center mb-4">Create Account</h4>}

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={submit}>
            <input
              className="form-control mb-3"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
              required
            />
            <input
              className="form-control mb-3"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
              required
            />
            <input
              className="form-control mb-3"
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
              required
            />
            <input
              className="form-control mb-3"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
              required
            />
            <input
              className="form-control mb-3"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
              required
            />

            <button className="btn btn-success w-100 py-2" disabled={loading}>
              {loading ? "Creating…" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
