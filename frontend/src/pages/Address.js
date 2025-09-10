import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Address.css";

export default function Address() {
  const location = useLocation();
  const product = location.state?.product; // ✅ Get product safely from navigation
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
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

  const BASE_URL = "http://localhost:9000";
  const navigate = useNavigate();

  // Load saved addresses
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/address/`, {
          withCredentials: true,
        });
        setAddresses(res.data || []);
      } catch (err) {
        console.error("Load addresses failed:", err);
      }
    };
    load();
  }, []);

  // Save / Update address
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && editId) {
        const res = await axios.put(`${BASE_URL}/api/address/${editId}`, form, {
          withCredentials: true,
        });
        setAddresses(addresses.map((a) => (a._id === editId ? res.data : a)));
        setIsEditing(false);
        setEditId(null);
      } else {
        const res = await axios.post(`${BASE_URL}/api/address/`, form, {
          withCredentials: true,
        });
        setAddresses([...addresses, res.data]);
      }
      setForm({
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
      setShowForm(false);
    } catch (err) {
      alert("⚠️ Failed to save address");
    }
  };

  // Delete address
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/address/${id}`, {
        withCredentials: true,
      });
      setAddresses(addresses.filter((a) => a._id !== id));
      if (selected === id) setSelected(null);
    } catch (err) {
      alert("⚠️ Failed to delete address");
    }
  };

  // Edit address
  const handleEdit = (addr) => {
    setForm(addr);
    setEditId(addr._id);
    setIsEditing(true);
    setShowForm(true);
  };

  // Deliver here
  const handleDeliver = () => {
    if (!selected) {
      return alert("Please select an address!");
    }

    if (!product || !product._id) {
      return alert("⚠️ No product selected. Please go back to cart.");
    }

    const qty = product.qty || 1;

    navigate(
      `/ordersummary?productId=${product._id}&qty=${qty}&addressId=${selected}`
    );
  };

  return (
    <div className="card p-3 address-container">
      <h5 className="mb-3">Delivery Address</h5>

      {!showForm ? (
        <>
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`address-box p-3 border rounded ${
                selected === addr._id ? "selected" : ""
              }`}
            >
              {/* Top Row: Info + Edit/Delete */}
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex">
                  <input
                    type="radio"
                    className="me-2"
                    checked={selected === addr._id}
                    onChange={() => setSelected(addr._id)}
                  />
                  <div>
                    <strong>{addr.name}</strong>{" "}
                    <span className="badge bg-light text-dark ms-2">
                      {addr.type}
                    </span>{" "}
                    <span className="ms-2">{addr.mobile}</span>
                    <div className="text-muted small">
                      {addr.addressLine1}, {addr.addressLine2},{" "}
                      {addr.landmark && `${addr.landmark}, `}
                      {addr.city}, {addr.state} - {addr.pincode}
                    </div>
                  </div>
                </div>

                <div className="btn-group-sm">
                  <button
                    className="btn btn-edit me-2"
                    onClick={() => handleEdit(addr)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(addr._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Deliver Button */}
              {selected === addr._id && (
                <div className="mt-3">
                  <button className="btn btn-warning" onClick={handleDeliver}>
                    Deliver Here
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => {
              setForm({
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
              setShowForm(true);
              setIsEditing(false);
              setEditId(null);
            }}
          >
            + Add a new address
          </button>
        </>
      ) : (
        <form className="address-form" onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Mobile"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            required
          />
          <input
            placeholder="Alternate Mobile"
            value={form.altMobile}
            onChange={(e) => setForm({ ...form, altMobile: e.target.value })}
          />
          <input
            placeholder="Address Line 1"
            value={form.addressLine1}
            onChange={(e) =>
              setForm({ ...form, addressLine1: e.target.value })
            }
            required
          />
          <input
            placeholder="Address Line 2"
            value={form.addressLine2}
            onChange={(e) =>
              setForm({ ...form, addressLine2: e.target.value })
            }
          />
          <input
            placeholder="Landmark"
            value={form.landmark}
            onChange={(e) => setForm({ ...form, landmark: e.target.value })}
          />
          <div className="row g-2">
            <div className="col">
              <input
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              />
            </div>
            <div className="col">
              <input
                placeholder="State"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                required
              />
            </div>
          </div>
          <input
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            required
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="Home">Home</option>
            <option value="Office">Office</option>
          </select>
          <div className="mt-3">
            <button className="btn btn-primary me-2">
              {isEditing ? "Update Address" : "Save Address"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
                setEditId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
