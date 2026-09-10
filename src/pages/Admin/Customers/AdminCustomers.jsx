import { useEffect, useState } from "react";
import { getCustomers, addManualCustomer } from "../../../utils/orders";
import "../Dashboard/AdminDashboard.css";

function AdminCustomers() {
  const [customers, setCustomers] = useState(getCustomers());
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const refresh = () => setCustomers(getCustomers());
    window.addEventListener("storage", refresh);
    window.addEventListener("ordersUpdated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ordersUpdated", refresh);
    };
  }, []);

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    addManualCustomer(form);
    setCustomers(getCustomers());
    setForm({ name: "", email: "" });
    setError("");
    setFormOpen(false);
  }

  return (
    <div className="admin-card">
      <div className="admin-toolbar">
        <h2 className="admin-card-title" style={{ marginBottom: 0 }}>
          All customers
        </h2>
        <button className="admin-btn" onClick={() => setFormOpen((v) => !v)}>
          {formOpen ? "Cancel" : "+ Add customer"}
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={handleAdd}
          style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}
        >
          <input
            className="admin-search-input"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            className="admin-search-input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <button type="submit" className="admin-btn">
            Save
          </button>
          {error && <p className="checkout-error" style={{ width: "100%" }}>{error}</p>}
        </form>
      )}

      {customers.length === 0 ? (
        <div className="admin-empty-state">
          <strong>No customers yet</strong>
          <p>Customer profiles will appear here after they add an item or check out.</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={`${c.email}-${i}`}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.orders}</td>
                <td>{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminCustomers;
