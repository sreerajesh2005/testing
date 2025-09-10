import React from "react";
import { Link } from "react-router-dom";
import "../styles/ProductCart.css";

function ProductCard({ product }) {
  const BASE_URL = "http://localhost:9000";

  // ✅ Normalize image URL
  const normalizeImage = (img) => {
    if (!img) return "";
    return img.startsWith("http")
      ? img
      : `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  return (
    <div className="product-card h-100">
      {/* Image */}
      <div className="product-img-wrapper">
        <img
          src={normalizeImage(product.image)}
          className="product-img"
          alt={product.name}
          onError={(e) => (e.target.style.display = "none")} // hide broken images
        />

        {/* Optional Quick View Overlay */}
        <div className="quick-view">
          <Link to={`/product/${product._id}`}>Quick View</Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="card-body d-flex flex-column text-center">
        <h5 className="card-title">{product.name}</h5>
        <p className="price">₹{product.price}</p>
        <Link
          to={`/product/${product._id}`}
          className="btn btn-primary mt-auto w-100"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
