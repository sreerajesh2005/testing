import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaHome, FaShoppingCart, FaUserCircle, FaSignInAlt, FaStore } from "react-icons/fa";

function Header() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:9000/api/auth/me", {
        withCredentials: true,
      });
      if (res.data) {
        setUser(res.data);
        setCart(res.data.cart || []);
      } else {
        setUser(null);
        setCart([]);
      }
    } catch {
      setUser(null);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchUser();
    const handleStorage = () => fetchUser();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark header-navbar">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FaStore className="me-2" /> E-Shop
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/">
                <FaHome className="me-1" /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/products">
                <FaStore className="me-1" /> Shop
              </Link>
            </li>
            <li className="nav-item position-relative">
              <Link className="nav-link d-flex align-items-center" to="/cart">
                <FaShoppingCart className="me-1" /> Cart
                {cart.length > 0 && (
                  <span className="badge bg-danger ms-1">{cart.length}</span>
                )}
              </Link>
            </li>
            {user ? (
              <li className="nav-item">
                <Link
                  className="nav-link d-flex align-items-center text-warning"
                  to="/profile"
                >
                  <FaUserCircle className="me-1" /> {user.name || user.email}
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link d-flex align-items-center"
                  to="/login"
                >
                  <FaSignInAlt className="me-1" /> Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
