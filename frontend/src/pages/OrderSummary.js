import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/OrderSummary.css"; // optional for styling

export default function OrderSummary() {
  const { state, search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search);

  const [product, setProduct] = useState(state?.product || null);
  const [address, setAddress] = useState(state?.address || null);
  const [loading, setLoading] = useState(!product || !address);
  const [error, setError] = useState("");

  const productId = query.get("productId");
  const qty = query.get("qty") || 1;
  const addressId = query.get("addressId");
 const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";

  useEffect(() => {
    const fetchData = async () => {
      if (product && address) {
        setLoading(false);
        return;
      }

      if (!productId || !addressId) {
        setError("Product or address not selected");
        setLoading(false);
        return;
      }

      try {
        const [productRes, addressRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/products/${productId}`),
          axios.get(`${BASE_URL}/api/address/${addressId}`, { withCredentials: true }),
        ]);

        setProduct({ ...productRes.data, qty: parseInt(qty) });
        setAddress(addressRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product or address. Please check your selection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [product, address, productId, addressId, qty]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">⚠️ {error}</p>;
  if (!product || !address) return <p className="text-danger">⚠️ Product or address missing</p>;

  const subtotal = product.price * product.qty;
  const tax = +(subtotal * 0.18).toFixed(2);
  const shipping = 49;
  const total = +(subtotal + tax + shipping).toFixed(2);

  // Prepare totals object for consistency
  const totals = { subtotal, tax, shipping, total };

  return (
    <div className="card p-4 my-4 shadow-sm">
      <h5 className="mb-2">Delivery Address</h5>
      <p>
        <strong>{address.name}</strong>, {address.mobile}, {address.addressLine1}, {address.addressLine2}{" "}
        {address.landmark && `${address.landmark}, `}{address.city}, {address.state} - {address.pincode} ({address.type})
      </p>

      <h5 className="mb-2">Product</h5>
      <div className="d-flex align-items-center mb-3">
        <img
          src={product.image || "https://via.placeholder.com/80"}
          alt={product.name}
          style={{ width: "80px", height: "80px", objectFit: "contain", marginRight: "15px" }}
        />
        <div>
          <div>{product.name}</div>
          <div>Qty: {product.qty}</div>
          <div>Price: ₹{product.price}</div>
        </div>
      </div>

      <h5 className="mb-2">Price Details</h5>
      <p>
        Subtotal: ₹{subtotal} <br />
        Tax (18%): ₹{tax} <br />
        Shipping: ₹{shipping} <br />
        <strong>Total: ₹{total}</strong>
      </p>

      <button
        className="btn btn-success w-100"
        onClick={() => navigate("/payment", { state: { product, address, totals } })}
      >
        Continue
      </button>
    </div>
  );
}
