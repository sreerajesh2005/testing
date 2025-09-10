// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Header from "./components/Header";
import Footer from "./components/Footer";

// User Pages
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Address from "./pages/Address";
import OrderSummary from "./pages/OrderSummary";
import Payment from "./pages/Payment";
import Success from "./pages/Success";

// Admin Pages
import Dashboard from "./admin/Dashboard";
import ManageProducts from "./admin/ManageProducts";
import AddProduct from "./admin/AddProduct";
import ManageOrders from "./admin/ManageOrders";



function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute ? (
        <>
          <Header />
          <main className="container my-4">
            <Routes>
              {/* User Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/address" element={<Address />} />
              <Route path="/ordersummary" element={<OrderSummary />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/success" element={<Success />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="text-center mt-5">
                    <h2>404 - Page Not Found</h2>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </>
      ) : (
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/orders" element={<ManageOrders />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
