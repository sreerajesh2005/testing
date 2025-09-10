import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/AddProduct.css";

export default function AddOrEditProduct() {
  const nav = useNavigate();
  const location = useLocation();
  const id = location.state?.id; // ✅ Get id from state
  const BASE_URL = "http://localhost:9000";

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "Mobiles",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();

        setForm({
          name: data.name,
          price: data.price,
          stock: data.stock || "",
          category: data.category,
          description: data.description || "",
        });

        setPreview(data.image);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", Number(form.price));
      formData.append("stock", Number(form.stock));
      formData.append("category", form.category);
      formData.append("description", form.description);
      if (image) formData.append("image", image);

      const url = id ? `${BASE_URL}/api/products/${id}` : `${BASE_URL}/api/products`;
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) {
        let data;
        try { data = await res.json(); } catch { data = {}; }
        throw new Error(data.message || "Failed to save product");
      }

      nav("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row add-product-container">
      <div className="col-md-3">
        <AdminSidebar />
      </div>

      <div className="col-md-9">
        <AdminHeader />
        <div className="p-3">
          <h4 className="mb-3">{id ? "Update Product" : "Add Product"}</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          <form className="add-product-form" onSubmit={submit}>
            <input
              className="form-control mb-3"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              className="form-control mb-3"
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />

            <input
              className="form-control mb-3"
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
            />

            <select
              className="form-select mb-3"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>Mobiles</option>
              <option>Laptops</option>
              <option>Accessories</option>
            </select>

            <div className="mb-3">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="img-thumbnail mb-2"
                  style={{ maxHeight: 150 }}
                />
              )}
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
                required={!id}
              />
            </div>

            <textarea
              className="form-control mb-3"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
            />

            <button className="btn btn-success w-100" disabled={loading}>
              {loading
                ? id
                  ? "Updating…"
                  : "Adding…"
                : id
                ? "Update Product"
                : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
