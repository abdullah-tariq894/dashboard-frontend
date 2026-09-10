import { useState } from "react";
import { toast } from "react-toastify";
import { IoLockClosedOutline } from "react-icons/io5";
import { checkAdminPassword } from "../../utils/adminAuth";
import "./AdminGate.css";

// Guards the /admin routes. Always starts locked — the password is
// asked fresh every time this gate mounts (every time the dashboard is
// opened), nothing is remembered across visits.
function AdminGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (unlocked) return children;

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = checkAdminPassword(password);
    if (!result.success) {
      setError(result.message);
      toast.error(result.message);
      return;
    }
    setError("");
    setUnlocked(true);
  };

  return (
    <div className="admin-gate">
      <form className="admin-gate-card" onSubmit={handleSubmit}>
        <div className="admin-gate-icon">
          <IoLockClosedOutline />
        </div>
        <h2>Dashboard Access</h2>
        <p>Enter the dashboard password to continue.</p>
        <input
          type="password"
          className="admin-gate-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <p className="admin-gate-error">{error}</p>}
        <button type="submit" className="admin-gate-btn">
          Unlock Dashboard
        </button>
      </form>
    </div>
  );
}

export default AdminGate;
