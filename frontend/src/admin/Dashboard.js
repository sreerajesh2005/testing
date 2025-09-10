import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import axios from "axios";
import "../styles/Dashboard.css"; // Zara style

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000"


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/orders/admin`, {
          withCredentials: true,
        });
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [BASE_URL]);

  const revenue = orders.reduce(
    (sum, o) => sum + ((o.totals && o.totals.total) || 0),
    0
  );
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/api/orders/admin/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Unable to update order status");
    }
  };

  const displayedOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <AdminHeader />

        {/* Stats Section */}
        <section className="stats-grid">
          <div
            className={`stat-card ${filterStatus === "All" ? "active" : ""}`}
            onClick={() => setFilterStatus("All")}
          >
            <h6>Total Orders</h6>
            <h2>{orders.length}</h2>
          </div>

          <div
            className={`stat-card ${filterStatus === "Pending" ? "active" : ""}`}
            onClick={() => setFilterStatus("Pending")}
          >
            <h6>Pending</h6>
            <h2>{pendingCount}</h2>
          </div>

          <div
            className={`stat-card ${filterStatus === "Delivered" ? "active" : ""}`}
            onClick={() => setFilterStatus("Delivered")}
          >
            <h6>Delivered</h6>
            <h2>{deliveredCount}</h2>
          </div>

          <div
            className={`stat-card ${filterStatus === "Cancelled" ? "active" : ""}`}
            onClick={() => setFilterStatus("Cancelled")}
          >
            <h6>Cancelled</h6>
            <h2>{cancelledCount}</h2>
          </div>

          <div className="stat-card">
            <h6>Revenue</h6>
            <h2>₹{revenue.toFixed(2)}</h2>
          </div>
        </section>

        {/* Orders Table */}
        <section className="orders">
  <h5>
    {filterStatus === "All" ? "Recent Orders" : `${filterStatus} Orders`}
  </h5>

  <div className="orders-list">
    {loading ? (
      <p>Loading…</p>
    ) : displayedOrders.length === 0 ? (
      <p>No orders found.</p>
    ) : (
      displayedOrders.slice(0, 10).map((o) => {
        const username = o.userId?.name || "N/A";
        const mobile = o.userId?.mobile || "N/A";
        const paymentMethod = o.paymentMethod || "N/A";
        const address = o.addressId
          ? `${o.addressId.name}, ${o.addressId.addressLine1}, ${o.addressId.addressLine2}, ${o.addressId.city}, ${o.addressId.state}, ${o.addressId.pincode}`
          : "N/A";

        return (
          <div key={o._id} className="order-row">
            <div className="order-info">
              <p><strong>ID:</strong> {o._id}</p>
              <p><strong>Date:</strong> {new Date(o.createdAt).toLocaleString()}</p>
              <p><strong>User:</strong> {username}</p>
              <p><strong>Mobile:</strong> {mobile}</p>
              <p><strong>Payment:</strong> {paymentMethod}</p>
              <p><strong>Address:</strong> {address}</p>
              <p><strong>Total:</strong> ₹{((o.totals && o.totals.total) || 0).toFixed(2)}</p>
            </div>

            <div className="order-products">
              {o.items?.length > 0 ? (
                o.items.map((p, i) => (
                  <div key={i} className="product-cell">
                    <img
                      src={p.productId?.image || "/placeholder.png"}
                      alt={p.productId?.name || "Product"}
                    />
                    <span>
                      {p.productId?.name || "N/A"} × {p.quantity || 1}
                    </span>
                  </div>
                ))
              ) : (
                <span>N/A</span>
              )}
            </div>

            <div className="order-status">
              <span className={`status ${o.status.toLowerCase()}`}>
                {o.status}
              </span>
              <select
                value={o.status}
                onChange={(e) => handleStatusChange(o._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        );
      })
    )}
  </div>
</section>

      </main>
    </div>
  );
}
