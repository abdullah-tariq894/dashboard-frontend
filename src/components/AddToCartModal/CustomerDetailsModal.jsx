import { useEffect, useState } from "react";
import { IoCloseOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import "./CustomerDetailsModal.css";

function CustomerDetailsModal({ product, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (error) setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("Please enter your name and email to continue.");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="customer-modal-overlay" onClick={onClose}>
      <section
        className="customer-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="customer-modal-header">
          <div>
            <span className="customer-modal-kicker">Quick checkout</span>
            <h2 id="customer-details-title">Your details first</h2>
            <p>We need a few details before adding this item to your cart.</p>
          </div>
          <button className="customer-modal-close" onClick={onClose} aria-label="Close">
            <IoCloseOutline />
          </button>
        </div>

        <div className="customer-modal-product">
          <img src={product?.image} alt={product?.name} />
          <div>
            <strong>{product?.name}</strong>
            <span>${product?.price}</span>
          </div>
        </div>

        <form className="customer-details-form" onSubmit={handleSubmit}>
          <label>
            Full name <span>*</span>
            <input
              autoFocus
              type="text"
              value={form.name}
              onChange={updateField("name")}
              placeholder="Alex Johnson"
            />
          </label>

          <label>
            Email address <span>*</span>
            <input
              type="email"
              value={form.email}
              onChange={updateField("email")}
              placeholder="alex@example.com"
            />
          </label>

          <div className="customer-details-row">
            <label>
              Phone number
              <input
                type="tel"
                value={form.phone}
                onChange={updateField("phone")}
                placeholder="+1 555 000 0000"
              />
            </label>
            <label>
              Delivery city
              <input
                type="text"
                value={form.address}
                onChange={updateField("address")}
                placeholder="City / area"
              />
            </label>
          </div>

          {error && <p className="customer-details-error">{error}</p>}

          <button className="customer-details-submit" type="submit">
            Add to cart
          </button>
          <p className="customer-details-note">
            <IoShieldCheckmarkOutline /> Your details stay in this dashboard only.
          </p>
        </form>
      </section>
    </div>
  );
}

export default CustomerDetailsModal;