import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/AdminSidebar.css";

export default function AdminSidebar() {
  return (
    <div className="admin-sidebar p-3">
      <h5 className="sidebar-title mb-4">Admin</h5>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/dashboard">Dashboard</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/products">Products</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/products/add">Add Product</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/orders">Orders</NavLink>
        </li>
      </ul>
    </div>
  );
}
