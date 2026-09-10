import { useState, useEffect } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { IoChevronForwardOutline, IoGridOutline, IoBagHandleOutline, IoPeopleOutline, IoReceiptOutline } from "react-icons/io5";
import "./AdminLayout.css";

const links = [
  { to: "/admin", label: "Dashboard", end: true, icon: IoGridOutline },
  { to: "/admin/products", label: "Products", icon: IoBagHandleOutline },
  { to: "/admin/orders", label: "Orders", icon: IoReceiptOutline },
  { to: "/admin/customers", label: "Customers", icon: IoPeopleOutline },
];

function AdminLayout() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [open, setOpen] = useState(() => window.innerWidth > 768);

  // Re-check on every resize — this is what fires when DevTools is
  // opened/closed too, since that shrinks the page's own viewport.
  // Without this the sidebar kept whatever state it had at first load
  // and could end up stuck open, covering the toggle button.
  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setOpen(!mobile);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="admin-shell">
      {isMobile && open && (
        <div className="admin-sidebar-backdrop" onClick={() => setOpen(false)} />
      )}

      <aside className={`admin-sidebar ${open ? "" : "admin-sidebar--closed"}`}>
        <Link to="/" className="admin-logo">
          SHOP<span>.CO</span>
        </Link>
        <nav className="admin-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => isMobile && setOpen(false)}
              className={({ isActive }) =>
                "admin-nav-link" + (isActive ? " admin-nav-link--active" : "")
              }
            >
              <l.icon />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="admin-back-link">
          &larr; Back to store
        </Link>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-btn"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            &#9776;
          </button>
          <div className="admin-topbar-heading">
            <span className="admin-topbar-eyebrow">Workspace</span>
            <h1 className="admin-topbar-title">Store dashboard</h1>
          </div>
          <div className="admin-topbar-user">
            <span className="admin-avatar">A</span>
            <span>Admin</span>
            <IoChevronForwardOutline />
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
