import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import DataTable from "./DataTable";
import "../styles/ManageOrders.css";

export default function ManageOrders() {
  const [rows, setRows] = useState([]);

  const load = async () => {
    const res = await fetch("http://localhost:9000/api/orders/admin", {
      credentials: "include",
    });
    const data = await res.json();
    setRows(data);
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    { key: "_id", label: "Order ID" },

    // Customer Details
    {
      key: "userId",
      label: "Name",
      render: (user) => user?.name || "N/A",
    },
    {
      key: "userId",
      label: "Mobile",
      render: (user) => user?.mobile || "N/A",
    },
    {
      key: "userId",
      label: "Email",
      render: (user) => user?.email || "N/A",
    },
    {
      key: "addressId",
      label: "Address",
      render: (a) =>
        a
          ? `${a.name}, ${a.addressLine1}, ${a.addressLine2}, ${a.city}, ${a.state}, ${a.pincode}`
          : "N/A",
    },

    // Order Details
    {
      key: "createdAt",
      label: "Date",
      render: (v) => new Date(v).toLocaleString(),
    },
    { key: "status", label: "Status" },
    { key: "paymentMethod", label: "Payment Method" },
    {
      key: "totals",
      label: "Total",
      render: (v) => `₹${(v?.total || 0).toFixed(2)}`,
    },

    // Product Details
    {
      key: "items",
      label: "Products",
      render: (items) =>
        items?.map((it, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "5px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={it.productId?.image || "/placeholder.png"}
              alt={it.productId?.name || "Product"}
              width={40}
              height={40}
              style={{
                objectFit: "cover",
                marginRight: "8px",
                borderRadius: "4px",
              }}
            />
            <span>
              {it.productId?.name || "N/A"} (x{it.quantity || 1})
            </span>
          </div>
        )) || "N/A",
    },
  ];

  return (
    <div className="row manage-orders-container">
      <div className="col-md-3">
        <AdminSidebar />
      </div>
      <div className="col-md-9">
        <AdminHeader />
        <div className="p-3">
          <h4 className="mb-3">Manage Orders</h4>
          <div className="table-responsive">
            <DataTable columns={columns} data={rows} />
          </div>
        </div>
      </div>
    </div>
  );
}
