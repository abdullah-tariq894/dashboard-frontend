import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoBagHandleOutline,
  IoPeopleOutline,
  IoReceiptOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import { getOrders, getCustomers } from "../../../utils/orders";
import "./AdminDashboard.css";

const salesByMonth = [
  { month: "Jan", value: 32 },
  { month: "Feb", value: 41 },
  { month: "Mar", value: 38 },
  { month: "Apr", value: 52 },
  { month: "May", value: 47 },
  { month: "Jun", value: 63 },
  { month: "Jul", value: 58 },
  { month: "Aug", value: 71 },
];

function readCart() {
  try {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

const statusClass = {
  Paid: "admin-badge admin-badge--paid",
  Pending: "admin-badge admin-badge--pending",
  Cancelled: "admin-badge admin-badge--cancelled",
};

function AdminDashboard() {
  const [cartItems, setCartItems] = useState(readCart());
  const [orders, setOrders] = useState(getOrders());
  const [customers, setCustomers] = useState(getCustomers());

  useEffect(() => {
    const refresh = () => {
      setCartItems(readCart());
      setOrders(getOrders());
      setCustomers(getCustomers());
    };
    window.addEventListener("storage", refresh);
    window.addEventListener("cartUpdated", refresh);
    window.addEventListener("ordersUpdated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("cartUpdated", refresh);
      window.removeEventListener("ordersUpdated", refresh);
    };
  }, []);

  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const itemsInCart = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const stats = [
    { label: "Total revenue", value: `$${revenue.toFixed(2)}`, note: "From completed checkouts", icon: IoTrendingUpOutline, tone: "rose" },
    { label: "Orders", value: orders.length, note: "All time orders", icon: IoReceiptOutline, tone: "blue" },
    { label: "Customers", value: customers.length, note: "Profiles captured", icon: IoPeopleOutline, tone: "purple" },
    { label: "Items in cart now", value: itemsInCart, note: "Live store activity", icon: IoBagHandleOutline, tone: "green" },
  ];

  const maxValue = Math.max(...salesByMonth.map((d) => d.value));
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-heading">
        <div>
          <span className="admin-section-kicker">Overview</span>
          <h2>Good morning, Admin</h2>
          <p>Keep an eye on your store performance and customer activity.</p>
        </div>
        <Link className="admin-outline-btn" to="/shop">
          View storefront
        </Link>
      </div>

      <div className="admin-stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="admin-card admin-stat-card">
            <div className="admin-stat-topline">
              <span className={`admin-stat-icon admin-stat-icon--${s.tone}`}>
                <s.icon />
              </span>
              <span className="admin-stat-period">Live</span>
            </div>
            <p className="admin-stat-label">{s.label}</p>
            <p className="admin-stat-value">{s.value}</p>
            <p className="admin-stat-note">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="admin-card admin-chart-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Sales trend</h2>
            <p className="admin-card-subtitle">Monthly performance overview</p>
          </div>
          <span className="admin-chart-legend"><i /> Sales</span>
        </div>
        <div className="admin-bar-chart">
          {salesByMonth.map((d) => (
            <div className="admin-bar-col" key={d.month}>
              <div
                className="admin-bar"
                style={{ height: `${(d.value / maxValue) * 100}%` }}
                title={`${d.month}: ${d.value}`}
              />
              <span className="admin-bar-label">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Recent orders</h2>
        </div>

        {recentOrders.length === 0 ? (
          <div className="admin-empty-state">
            <span className="admin-empty-icon"><IoReceiptOutline /></span>
            <strong>No orders yet</strong>
            <p>New orders will appear here as soon as customers check out.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customerName}</td>
                  <td>${o.total}</td>
                  <td>
                    <span className={statusClass[o.status]}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Items currently in cart</h2>
        </div>

        {cartItems.length === 0 ? (
          <p style={{ color: "#888888", padding: "12px 0" }}>
            Cart is empty right now.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Size / Color</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, i) => (
                <tr key={`${item.id}-${item.size}-${item.color}-${i}`}>
                  <td>{item.name}</td>
                  <td>{item.size} / {item.color}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
