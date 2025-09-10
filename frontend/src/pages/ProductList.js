import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCart";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:9000/api/products");
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to load products");

        const normalized = (data.products || data).map(p => ({ ...p, id: p._id }));
        setProducts(normalized);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products]
  );

  const filtered = useMemo(() => {
    let out = products;
    if (q) out = out.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (cat !== "All") out = out.filter((p) => p.category === cat);
    return out;
  }, [products, q, cat]);

  return (
    <div className="row">
      <aside className="col-md-3 mb-3">
        <div className="card p-3">
          <h5>Filters</h5>
          <input
            className="form-control mb-2"
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="form-select"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </aside>

      <main className="col-md-9">
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="row g-3">
            {filtered.length === 0 && <p className="text-muted">No products found.</p>}
            {filtered.map((p) => (
              <div className="col-6 col-md-4" key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
