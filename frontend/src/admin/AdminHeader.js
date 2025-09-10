import React, { useEffect, useState } from "react";
import "../styles/AdminHeader.css"; // make sure the file is in the same folder

export default function AdminHeader() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:9000/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user || d))
      .catch(() => setUser(null));
  }, []);

  return (
    <header className="admin-header">
      <h4 className="admin-title">Admin Panel</h4>
      <div className="admin-user">
        <div className="admin-avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
        </div>
        <span className="admin-email">{user?.email || "admin@example.com"}</span>
      </div>
    </header>
  );
}
