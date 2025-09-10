import React from "react";
import "../styles/DataTable.css";

export default function DataTable({ columns, data, actions }) {
  return (
    <div className="table-responsive data-table-container">
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-light">
          <tr>
            {columns.map(c => <th key={c.key}>{c.label}</th>)}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row._id || row.id}>
              {columns.map(c => (
                <td key={c.key}>{c.render ? c.render(row[c.key], row) : (row[c.key] ?? '')}</td>
              ))}
              {actions && (
                <td>
                  {actions.map((a, idx) => (
                    <button
                      key={idx}
                      className="btn btn-sm btn-outline-primary me-2 mb-1"
                      onClick={() => a.onClick(row)}
                    >
                      {a.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
