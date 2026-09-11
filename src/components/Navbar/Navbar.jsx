import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoSearchOutline,
  IoCartOutline,
  IoPersonOutline,
  IoMenuOutline,
  IoChevronDownOutline,
  IoCloseOutline,
  IoGridOutline,
} from "react-icons/io5";

import { fetchAdminProducts } from "../../utils/adminProductsBridge";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // LocalStorage se total items count karna
  const updateCartCount = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        const total = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(total);
      } catch (err) {
        console.error("Cart parsing error:", err);
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    // Outside Click handler for Search Dropdown
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Live Search Fetching — main backend ke search ke saath Admin dashboard
  // ke products bhi (naam se match karke) dropdown mein shamil karte hain,
  // chunke admin backend khud search query support nahi karta.
  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length > 1) {
      setIsSearching(true);
      let cancelled = false;

      const mainFetch = fetch(
        `https://dashboard-backend-beta-orpin.vercel.app/api/products?search=${encodeURIComponent(query)}`
      )
        .then((res) => res.json())
        .catch((err) => {
          console.error("Search fetch error:", err);
          return [];
        });

      Promise.all([mainFetch, fetchAdminProducts()]).then(
        ([mainResults, adminProducts]) => {
          if (cancelled) return;
          const base = Array.isArray(mainResults) ? mainResults : [];
          const matchingAdmin = adminProducts.filter((p) =>
            (p.name || "").toLowerCase().includes(query.toLowerCase())
          );
          // Response limit to 5 items for clean dropdown
          setSearchResults([...matchingAdmin, ...base].slice(0, 5));
          setIsSearching(false);
        }
      );

      return () => {
        cancelled = true;
      };
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchResults([]);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  const handleProductSelect = (productId) => {
    navigate(`/product/${productId}`);
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <nav className={`navbar ${isSticky ? "sticky" : ""}`}>

      <button 
        className="mobile-menu" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
      </button>

      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/" onClick={() => setMenuOpen(false)}>SHOP.CO</Link>
      </div>

      {/* Navigation Links */}
      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <Link to="/shop" onClick={() => setMenuOpen(false)}>
          Shop <IoChevronDownOutline className="shop-arrow" />
        </Link>
        <Link to="/shop?category=sale" onClick={() => setMenuOpen(false)}>On Sale</Link>
        <Link to="/shop?category=new" onClick={() => setMenuOpen(false)}>New Arrivals</Link>
        <Link to="/shop?category=brands" onClick={() => setMenuOpen(false)}>Brands</Link>
      </div>

      {/* Live Search Bar */}
      <div className="navbar-search" ref={searchRef}>
        <IoSearchOutline className="search-icon" />
        <input 
          type="text" 
          placeholder="Search for products..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchSubmit}
        />

        {/* Live Search Autocomplete Dropdown */}
        {(searchResults.length > 0 || isSearching) && (
          <div className="search-dropdown">
            {isSearching ? (
              <div className="search-loading">Searching...</div>
            ) : (
              searchResults.map((item) => (
                <div 
                  key={item._id || item.id} 
                  className="search-item"
                  onClick={() => handleProductSelect(item._id || item.id)}
                >
                  <img src={item.image || "/shirt1.png"} alt={item.name} />
                  <div className="search-item-info">
                    <p className="search-item-title">{item.name}</p>
                    <span className="search-item-price">${item.price}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        <button className="mobile-search" aria-label="Search" onClick={() => navigate("/shop")}>
          <IoSearchOutline />
        </button>

        <div className="cart-icon-container">
          <button 
            className="nav-icon" 
            aria-label="Cart"
            onClick={() => navigate("/cart")}
          >
            <IoCartOutline />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
        </div>

        {/* Dashboard: always routes to /admin, which itself always asks
            for the password (see AdminGate) — no shortcut is kept here
            so it can never skip the prompt. */}
        <button className="nav-icon" aria-label="Dashboard" onClick={() => navigate("/admin")}>
          <IoGridOutline />
        </button>

        <button className="nav-icon" aria-label="Account" onClick={() => navigate("/login")}>
          <IoPersonOutline />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
