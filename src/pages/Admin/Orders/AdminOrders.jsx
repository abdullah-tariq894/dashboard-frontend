import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../../utils/orders";
import "../Dashboard/AdminDashboard.css";

const statusOptions = ["Pending", "Paid", "Cancelled"];

const statusClass = {
  Paid: "admin-badge admin-badge--paid",
  Pending: "admin-badge admin-badge--pending",
  Cancelled: "admin-badge admin-badge--cancelled",
};

function AdminOrders() {
  const [orders, setOrders] = useState(getOrders());

  useEffect(() => {
    const refresh = () => setOrders(getOrders());
    window.addEventListener("storage", refresh);
    window.addEventListener("ordersUpdated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ordersUpdated", refresh);
    };
  }, []);

  function handleStatusChange(id, status) {
    updateOrderStatus(id, status);
    setOrders(getOrders());
  }

  return (
    <div className="admin-card">
      <div className="admin-toolbar">
        <h2 className="admin-card-title" style={{ marginBottom: 0 }}>
          All orders
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty-state">
          <strong>No orders yet</strong>
          <p>Orders will appear here automatically after a customer checks out.</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>
                  {o.customerName}
                  <br />
                  <span style={{ color: "#888888", fontSize: "12px" }}>{o.customerEmail}</span>
                </td>
                <td>{o.items.reduce((sum, it) => sum + (it.quantity || 1), 0)} items</td>
                <td>${o.total}</td>
                <td>
                  <span className={statusClass[o.status]}>{o.status}</span>
                </td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ddd" }}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminOrders;
