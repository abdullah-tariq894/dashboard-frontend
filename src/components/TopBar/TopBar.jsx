import { useState } from "react";
import { IoClose } from "react-icons/io5";
import "./TopBar.css";

function TopBar() {
  const [showBar, setShowBar] = useState(true);

  if (!showBar) {
    return null;
  }

  return (
    <div className="top-bar">
      <p className="top-bar-text">
        Sign up and get 20% off to your first order.
        <a href="/signup">Sign Up Now</a>
      </p>

      <button
        className="top-bar-close"
        onClick={() => setShowBar(false)}
        aria-label="Close"
      >
        <IoClose />
      </button>
    </div>
  );
}

export default TopBar;