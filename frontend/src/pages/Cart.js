import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Cart.css";

export default function Cart() {
  const [items, setItems] = useState([]);
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";

  const navigate = useNavigate();

  // Normalize image URL
  const normalizeImage = (img) => {
    if (!img) return "";
    return img.startsWith("http")
      ? img
      : `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  // Load cart items
  const loadCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/cart`, {
        withCredentials: true,
      });
      const validItems = res.data.filter(
        (i) => i.productId && typeof i.productId.price === "number"
      );
      setItems(validItems);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Update quantity (optimistic update + sync with backend)
  const updateQty = async (id, quantity) => {
    if (quantity < 1) return;

    // ✅ Optimistic UI update
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );

    try {
      await axios.put(`${BASE_URL}/api/cart/${id}`, { quantity }, { withCredentials: true });
    } catch (err) {
      console.error("Error updating quantity:", err);
      // reload from server if update fails
      loadCart();
    }
  };

  // Remove item
  const removeItem = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/cart/${id}`, {
        withCredentials: true,
      });
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // Buy Now → redirect to checkout with product + quantity
  const handleBuyNow = (item) => {
    navigate("/address", {
      state: { product: { ...item.productId, qty: item.quantity } },
    });
  };

  // ✅ Calculate total price
  const totalPrice = items.reduce(
    (sum, i) => sum + i.productId.price * i.quantity,
    0
  );

  if (!items.length)
    return (
      <div className="cart-empty text-center p-5">
        <h4>Your cart is empty</h4>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/products")}
        >
          Shop Now
        </button>
      </div>
    );

  return (
    <div className="container cart-page py-4">
      {items.map((i) => (
        <div
          key={i._id}
          className="cart-item d-flex align-items-center border rounded p-3 mb-3"
        >
          <img
            src={normalizeImage(i.productId.image)}
            alt={i.productId.name}
            className="cart-item-img me-3"
          />
          <div className="flex-grow-1">
            <h6 className="mb-1">{i.productId.name}</h6>
            <p className="mb-1 text-muted">₹{i.productId.price}</p>

            {/* Quantity buttons */}
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => updateQty(i._id, i.quantity - 1)}
              >
                -
              </button>
              <span className="px-2">{i.quantity}</span>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => updateQty(i._id, i.quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="text-end">
            {/* ✅ Price updates instantly with quantity */}
            <p className="mb-2 fw-bold">
              ₹{(i.productId.price * i.quantity).toFixed(2)}
            </p>
            <div className="d-flex flex-column gap-1">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleBuyNow(i)}
              >
                Buy Now
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => removeItem(i._id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
