import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import DataTable from "./DataTable";
import { useNavigate } from "react-router-dom";
import "../styles/ManageProducts.css";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const BASE_URL = "http://localhost:9000";
  const navigate = useNavigate();

  // Load all products
  const load = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      const updatedData = data.map((p) => ({
        ...p,
        image: p.image?.startsWith("http")
          ? p.image
          : `${BASE_URL}${p.image.startsWith("/") ? "" : "/"}${p.image}`,
      }));

      setProducts(updatedData);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Delete product
  const deleteProduct = async (row) => {
    if (!window.confirm(`Are you sure you want to delete "${row.name}"?`)) return;

    try {
      const res = await fetch(`${BASE_URL}/api/products/${row._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      await load();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Edit product
const editProduct = (row) => navigate("/admin/products/add", { state: { id: row._id } });


  // Table columns
  const columns = [
    {
      key: "image",
      label: "Image",
      render: (v, row) => (
        <img
          src={row.image}
          alt={row.name}
          className="product-img"
          style={{
            width: 80,
            height: 80,
            objectFit: "cover",
            borderRadius: "8px",
          }}
          onError={(e) => (e.target.style.display = "none")}
        />
      ),
    },
    { key: "name", label: "Name" },
    {
      key: "price",
      label: "Price",
      render: (v) => `₹${v}`,
    },
    { key: "category", label: "Category" },
    { key: "stock", label: "Stock" },
  ];

  // Actions
  const actions = [
    { label: "Edit", onClick: editProduct },
    { label: "Delete", onClick: deleteProduct },
  ];

  return (
    <div className="row manage-products-container">
      <div className="col-md-3">
        <AdminSidebar />
      </div>
      <div className="col-md-9">
        <AdminHeader />
        <div className="p-3">
          <h4 className="mb-3">Manage Products</h4>

          {/* Clean plain table without card styles */}
          <div className="table-responsive">
            <DataTable columns={columns} data={products} actions={actions} />
          </div>
        </div>
      </div>
    </div>
  );
}
