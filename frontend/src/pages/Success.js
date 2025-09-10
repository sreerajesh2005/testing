import React from "react";

export default function Success() {
  return (
    <div className="text-center mt-5">
      <h2>🎉 Order Successful!</h2>
      <p>Your order has been placed successfully.</p>
      <a href="/" className="btn btn-success mt-3">Go Home</a>
    </div>
  );
}
