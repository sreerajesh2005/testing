import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [activeTab, setActiveTab] = useState("overview");

  // address state
  const [addressForm, setAddressForm] = useState({
    name: "",
    mobile: "",
    altMobile: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    type: "Home",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = "http://localhost:9000";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/me`, {
          withCredentials: true,
        });
        setUser(res.data);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          mobile: res.data.mobile || "",
        });
        loadOrders();
        loadAddresses();
      } catch {
        navigate("/login");
      }
    };

    const loadOrders = async () => {
      try {
        setLoading(true);
        const resOrders = await axios.get(`${BASE_URL}/api/orders/my`, {
          withCredentials: true,
        });

        const ordersWithTotals = resOrders.data.map((o) => {
          if (!o.totals?.total) {
            const subtotal = o.items.reduce(
              (sum, p) => sum + (p.price || 0) * (p.quantity || 0),
              0
            );
            const tax = +(subtotal * 0.18).toFixed(2);
            const shipping = o.items.length ? 49 : 0;
            const total = +(subtotal + tax + shipping).toFixed(2);
            o.totals = { subtotal, tax, shipping, total };
          }

          o.items = o.items.map((item) => ({
            ...item,
            productId:
              typeof item.productId === "string"
                ? { _id: item.productId, name: "Unknown Product", image: "" }
                : item.productId,
          }));

          return o;
        });

        setOrders(
          ordersWithTotals.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    const loadAddresses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/address/`, {
          withCredentials: true,
        });
        setAddresses(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${BASE_URL}/api/auth/profile`, form, {
        withCredentials: true,
      });
      setUser(data);
      alert("Profile updated successfully");
    } catch {
      alert("Update failed");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch {}
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.put(
        `${BASE_URL}/api/orders/${orderId}/cancel`,
        {},
        { withCredentials: true }
      );
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch {
      alert("Unable to cancel order");
    }
  };

  const handleReviewOrder = (orderId) => {
    navigate(`/review/${orderId}`);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && editId) {
        const res = await axios.put(
          `${BASE_URL}/api/address/${editId}`,
          addressForm,
          {
            withCredentials: true,
          }
        );
        setAddresses(addresses.map((a) => (a._id === editId ? res.data : a)));
      } else {
        const res = await axios.post(
          `${BASE_URL}/api/address/`,
          addressForm,
          {
            withCredentials: true,
          }
        );
        setAddresses([...addresses, res.data]);
      }
      setAddressForm({
        name: "",
        mobile: "",
        altMobile: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        type: "Home",
      });
      setIsEditing(false);
      setEditId(null);
      setShowAddressForm(false);
    } catch {
      alert("Failed to save address");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/address/${id}`, {
        withCredentials: true,
      });
      setAddresses(addresses.filter((a) => a._id !== id));
    } catch {
      alert("Failed to delete address");
    }
  };

  const handleEditAddress = (addr) => {
    setAddressForm(addr);
    setIsEditing(true);
    setEditId(addr._id);
    setShowAddressForm(true);
  };

  const renderProgress = (status) => {
    const steps = ["Ordered", "Shipped", "Out for Delivery", "Delivered"];
    let currentStep = 0;

    if (status === "Processing" || status === "Ordered") currentStep = 0;
    else if (status === "Shipped") currentStep = 1;
    else if (status === "Out for Delivery") currentStep = 2;
    else if (status === "Delivered") currentStep = 3;
    else if (status === "Cancelled")
      return <p className="cancelled-text">Order Cancelled</p>;

    return (
      <div className="progress-steps">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`progress-step ${index <= currentStep ? "active" : ""}`}
          >
            <div className="circle"></div>
            <span>{step}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <aside className="sidebar">
        <h3>My Account</h3>
        <button onClick={() => setActiveTab("overview")} className="btn-tab">
          Overview
        </button>
        <button onClick={() => setActiveTab("profile")} className="btn-tab">
          Manage Profile
        </button>
        <button onClick={() => setActiveTab("address")} className="btn-tab">
          Manage Address
        </button>
        <button onClick={() => setActiveTab("orders")} className="btn-tab">
          My Orders
        </button>
        <button onClick={() => setActiveTab("support")} className="btn-tab">
          Support
        </button>
        <button
          className="btn btn-outline-danger mt-3 w-100"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      <main className="profile-content">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="overview">
            <h2>Welcome, {user.name}</h2>
            <div className="overview-cards">
              <div className="card">
                <h5>User Info</h5>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </div>

              <div className="card">
                <h5>Recent Order</h5>
                {orders.length > 0 ? (
                  <div className="order-card">
                    {orders[0].items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <img
                          src={
                            item.productId && item.productId.image
                              ? item.productId.image
                              : "https://via.placeholder.com/150"
                          }
                          alt={item.productId?.name || "Product Image"}
                          className="order-img"
                        />

                        <div>
                          <h6>{item.productId?.name}</h6>
                          <small>₹{item.price.toFixed(2)}</small> <br></br>
                          <small>Qty: {item.quantity}</small> <br></br>
                          <small>
                            Ordered on{" "}
                            {new Date(orders[0].createdAt).toLocaleDateString()}
                          </small>

                          {renderProgress(orders[0].status)}

                          {orders[0].status === "Delivered" && (
                            <button
                              className="btn btn-success btn-sm mt-1"
                              onClick={() => handleReviewOrder(orders[0]._id)}
                            >
                              Review
                            </button>
                          )}
                          {orders[0].status !== "Delivered" &&
                            orders[0].status !== "Cancelled" &&
                            orders[0].status !== "Refunded" && (
                              <button
                                className="btn btn-outline-danger btn-sm mt-1"
                                onClick={() =>
                                  handleCancelOrder(orders[0]._id)
                                }
                              >
                                Cancel Order
                              </button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No recent orders.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Profile */}
        {activeTab === "profile" && (
          <div>
            <h3>Manage Profile</h3>
            <form onSubmit={handleProfileUpdate}>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="form-control mb-2"
                required
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="form-control mb-2"
                required
              />
              <input
                type="tel"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
                className="form-control mb-2"
                pattern="\d{10}"
              />
              <button type="submit" className="btn btn-primary">
                Update Profile
              </button>
            </form>
          </div>
        )}

        {/* Address */}
        {activeTab === "address" && (
          <div className="address-management">
            <h3>Manage Address</h3>

            {addresses.map((addr) => (
              <div key={addr._id} className="address-card">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <div className="d-flex align-items-center mb-1">
                      <strong className="me-2">{addr.name}</strong>
                      <span className="badge bg-secondary me-2">
                        {addr.type}
                      </span>
                      <span>{addr.mobile}</span>
                    </div>
                    <p className="mb-1 text-muted">
                      {addr.addressLine1}, {addr.addressLine2},{" "}
                      {addr.landmark}, {addr.city}, {addr.state} -{" "}
                      {addr.pincode}
                    </p>
                  </div>
                  <div>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditAddress(addr)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteAddress(addr._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Show form only when editing */}
            {showAddressForm && (
              <form
                className="address-form"
                onSubmit={handleAddressSubmit}
              >
                <input
                  placeholder="Name"
                  value={addressForm.name}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      name: e.target.value,
                    })
                  }
                  required
                />
                <input
                  placeholder="Mobile"
                  value={addressForm.mobile}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      mobile: e.target.value,
                    })
                  }
                  required
                />
                <input
                  placeholder="Alternate Mobile"
                  value={addressForm.altMobile}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      altMobile: e.target.value,
                    })
                  }
                />
                <input
                  placeholder="Address Line 1"
                  value={addressForm.addressLine1}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      addressLine1: e.target.value,
                    })
                  }
                  required
                />
                <input
                  placeholder="Address Line 2"
                  value={addressForm.addressLine2}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      addressLine2: e.target.value,
                    })
                  }
                />
                <input
                  placeholder="Landmark"
                  value={addressForm.landmark}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      landmark: e.target.value,
                    })
                  }
                />
                <input
                  placeholder="City"
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      city: e.target.value,
                    })
                  }
                  required
                />
                <input
                  placeholder="State"
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      state: e.target.value,
                    })
                  }
                  required
                />
                <input
                  placeholder="Pincode"
                  value={addressForm.pincode}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      pincode: e.target.value,
                    })
                  }
                  required
                />
                <select
                  value={addressForm.type}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                </select>
                <div className="d-flex gap-2 mt-2">
                  <button type="submit" className="btn btn-primary">
                    Update Address
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddressForm(false);
                      setIsEditing(false);
                      setEditId(null);
                      setAddressForm({
                        name: "",
                        mobile: "",
                        altMobile: "",
                        addressLine1: "",
                        addressLine2: "",
                        landmark: "",
                        city: "",
                        state: "",
                        pincode: "",
                        type: "Home",
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="orders-section">
            <h3>My Orders</h3>
            {loading ? (
              <div className="spinner-border"></div>
            ) : orders.length > 0 ? (
              orders.map((o) => (
                <div key={o._id} className="order-card">
                  {o.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <img
                        src={
                          item.productId && item.productId.image
                            ? item.productId.image
                            : "https://via.placeholder.com/150"
                        }
                        alt={item.productId?.name || "Product Image"}
                        className="order-img"
                      />
                      <div>
                        <h6>{item.productId?.name}</h6>
                        <small>₹{item.price.toFixed(2)}</small> <br></br>
                        <small>
                          Ordered on{" "}
                          {new Date(o.createdAt).toLocaleDateString()}
                        </small>

                        {renderProgress(o.status)}

                        {o.status === "Delivered" && (
                          <button
                            className="btn btn-success btn-sm mt-1"
                            onClick={() => handleReviewOrder(o._id)}
                          >
                            Review
                          </button>
                        )}
                        {o.status !== "Delivered" &&
                          o.status !== "Cancelled" &&
                          o.status !== "Refunded" && (
                            <button
                              className="btn btn-outline-danger btn-sm mt-1"
                              onClick={() => handleCancelOrder(o._id)}
                            >
                              Cancel Order
                            </button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        )}

        {/* Support */}
        {activeTab === "support" && (
          <div>
            <h3>Support</h3>
            <p>
              For support, please contact support@example.com or call +91
              98765 43210
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
