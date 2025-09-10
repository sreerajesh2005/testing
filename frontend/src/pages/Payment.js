import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Payment.css";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
   const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:9000";

  const product = state?.product;
  const address = state?.address;
  const totals = state?.totals;

  const [method, setMethod] = useState("UPI");
  const [selectedUPI, setSelectedUPI] = useState("Google Pay");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [selectedBank, setSelectedBank] = useState("HDFC");

  if (!product || !address || !totals) {
    return (
      <div className="container my-4">
        <p className="text-danger">⚠️ Payment details missing. Please go back to order summary.</p>
        <button className="btn btn-primary" onClick={() => navigate("/ordersummary")}>
          Go Back
        </button>
      </div>
    );
  }

  const gstRate = 0.18;
  const deliveryCharge = 50;
  const gstAmount = Math.round(product.price * gstRate);
  const finalTotal = product.price + gstAmount + deliveryCharge;

  const handlePay = async () => {
    try {
      let paymentMethod = "";
      let paymentDetails = {};

      if (method === "UPI") {
        paymentMethod = "UPI";
        paymentDetails = { upiId: selectedUPI };
      } else if (method === "Credit/Debit Card") {
        paymentMethod = "Card";
        paymentDetails = { cardNumber: cardDetails.cardNumber, bankName: "Card Payment" };
      } else if (method === "Net Banking") {
        paymentMethod = "NetBanking";
        paymentDetails = { bankName: selectedBank };
      } else {
        paymentMethod = "COD";
      }

      const payload = {
        items: [
          {
            productId: product._id,
            quantity: product.qty || 1,
            price: product.price,
          },
        ],
        totals: {
          subtotal: product.price,
          tax: gstAmount,
          shipping: deliveryCharge,
          total: finalTotal,
        },
        addressId: address._id,
        paymentMethod,
        paymentDetails,
      };

      await axios.post(`${BASE_URL}/api/orders/`, payload, { withCredentials: true });
      navigate("/success");
    } catch (err) {
      console.error(err);
      alert("Payment failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container my-4">
      <div className="row g-4">
        {/* Payment Options */}
        <div className="col-lg-7">
          <h5 className="mb-3">Select Payment Method</h5>
          <div className="card p-3 mb-3">
            <h6>Payment Type</h6>
            <select className="form-select mt-2" value={method} onChange={(e) => setMethod(e.target.value)}>
              {["UPI", "Credit/Debit Card", "Net Banking", "Cash on Delivery"].map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <div className="mt-3">
              {method === "UPI" && (
                <>
                  <h6>Choose UPI App</h6>
                  <select className="form-select mt-2" value={selectedUPI} onChange={(e) => setSelectedUPI(e.target.value)}>
                    {["Google Pay", "PhonePe", "Paytm", "Amazon Pay", "CRED"].map((upi) => (
                      <option key={upi} value={upi}>{upi}</option>
                    ))}
                  </select>
                </>
              )}

              {method === "Credit/Debit Card" && (
                <div className="mt-2">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Card Number"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                  />
                  <div className="row mb-2">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="CVV"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cardholder Name"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  />
                </div>
              )}

              {method === "Net Banking" && (
                <>
                  <h6>Select Bank</h6>
                  <select className="form-select mt-2" value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
                    {["HDFC", "ICICI", "SBI", "Axis", "Kotak"].map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </>
              )}

              {method === "Cash on Delivery" && (
                <p className="text-muted mt-2">You will pay on delivery.</p>
              )}
            </div>
          </div>

          <button className="btn btn-warning w-100 mt-3" onClick={handlePay}>
            Pay ₹{finalTotal}
          </button>
        </div>

        {/* Price Summary */}
        <div className="col-lg-5">
          <div className="card p-3">
            <h6>Price Details</h6>
            <hr />
            <p>Price ({product.qty || 1} item{product.qty > 1 ? "s" : ""}): ₹{product.price}</p>
            <p>GST (18%): ₹{gstAmount}</p>
            <p>Delivery Charges: ₹{deliveryCharge}</p>
            <hr />
            <p><strong>Final Total: ₹{finalTotal}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
