import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddToCart } from "../../hooks/useAddToCart";
import { fetchAdminProducts } from "../../utils/adminProductsBridge";
import "./Shop.css";

import filterIcon from "../../assets/filterIcon.png";
import arrowIcon from "../../assets/sort-arrow.png";
import TopBar from "../../components/TopBar/TopBar";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function Shop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { requestAddToCart, customerDetailsModal } = useAddToCart();

  // Main storefront backend + Admin dashboard ke products dono merge karke
  // dikhate hain, bina purane backend ko chhede.
  useEffect(() => {
    let cancelled = false;

    const mainFetch = fetch("https://shop-co-backend-sigma.vercel.app/api/products")
      .then((res) => res.json())
      .catch((err) => {
        console.error("Shop products load nahi ho sake:", err);
        return [];
      });

    Promise.all([mainFetch, fetchAdminProducts()]).then(
      ([mainProducts, adminProducts]) => {
        if (cancelled) return;
        const base = Array.isArray(mainProducts) ? mainProducts : [];
        setProducts([...adminProducts.slice().reverse(), ...base]);
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [minPrice, setMinPrice] = useState(50);
  const [maxPrice, setMaxPrice] = useState(300);

  const [appliedFilters, setAppliedFilters] = useState({
    sizes: [],
    colors: [],
    styles: [],
    minPrice: 50,
    maxPrice: 300,
  });

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((item) => item !== color) : [...prev, color]
    );
  };

  const toggleStyle = (style) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((item) => item !== style) : [...prev, style]
    );
  };

  const applyFilters = () => {
    setAppliedFilters({
      sizes: selectedSizes,
      colors: selectedColors,
      styles: selectedStyles,
      minPrice,
      maxPrice,
    });
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedStyles([]);
    setMinPrice(50);
    setMaxPrice(300);
    setAppliedFilters({
      sizes: [],
      colors: [],
      styles: [],
      minPrice: 50,
      maxPrice: 300,
    });
  };

  /* Product Click Handler with Instant Top Scroll */
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    window.scrollTo(0, 0); // Directly detail page ke top par scroll karega
  };

  /* Filter Logic */
  const filteredProducts = products.filter((product) => {
    // Admin dashboard products don't carry size/color/style/price-range
    // metadata (its "Add product" form doesn't collect that), so always
    // show them instead of letting the sidebar filters hide them.
    if (product.source === "admin") return true;

    const sizeMatch =
      appliedFilters.sizes.length === 0 ||
      appliedFilters.sizes.some((size) => product.sizes?.includes(size));

    const colorMatch =
      appliedFilters.colors.length === 0 ||
      appliedFilters.colors.some((color) => product.colors?.includes(color));

    const styleMatch =
      appliedFilters.styles.length === 0 ||
      appliedFilters.styles.includes(product.category);

    const priceMatch =
      product.price >= appliedFilters.minPrice &&
      product.price <= appliedFilters.maxPrice;

    return sizeMatch && colorMatch && styleMatch && priceMatch;
  });

  return (
    <>
      <TopBar />
      <Navbar />

      <div className="shop-page">
        {/* Breadcrumb */}
        <div className="shop-breadcrumb">
          <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            Home
          </span>
          <span>&gt;</span>
          <span className="breadcrumb-active">Casual</span>
        </div>

        {/* Shop Layout */}
        <div className={`shop-layout ${filterOpen ? "filter-is-open" : ""}`}>
          <div
            className={`filter-overlay ${filterOpen ? "show" : ""}`}
            onClick={() => setFilterOpen(false)}
          ></div>

          {/* Sidebar */}
          <aside className="shop-filters">
            <div className="filters-header">
              <h2>Filters</h2>
              <div className="header-actions">
                <img src={filterIcon} alt="Filter" className="filter-header-icon" />
                <button className="filter-close" onClick={() => setFilterOpen(false)}>
                  ×
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="filter-group">
              <div className="category-list">
                {categories.map((category) => (
                  <div key={category} className="category-item">
                    <span>{category}</span>
                    <img src={arrowIcon} alt="" className="arrow-right" />
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="filter-group">
              <div className="filter-title">
                <span>Price</span>
                <img src={arrowIcon} alt="" />
              </div>
              <div className="price-range">
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={minPrice}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value < maxPrice) setMinPrice(value);
                  }}
                />
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={maxPrice}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value > minPrice) setMaxPrice(value);
                  }}
                />
              </div>
              <div className="price-values">
                <span>${minPrice}</span>
                <span>${maxPrice}</span>
              </div>
            </div>

            {/* Colors */}
            <div className="filter-group">
              <div className="filter-title">
                <span>Colors</span>
                <img src={arrowIcon} alt="" />
              </div>
              <div className="filter-colors">
                {[
                  "green",
                  "red",
                  "yellow",
                  "orange",
                  "cyan",
                  "blue",
                  "purple",
                  "pink",
                  "white",
                  "black",
                ].map((color) => (
                  <button
                    key={color}
                    className={`color ${color} ${
                      selectedColors.includes(color) ? "color-selected" : ""
                    }`}
                    onClick={() => toggleColor(color)}
                  ></button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="filter-group">
              <div className="filter-title">
                <span>Size</span>
                <img src={arrowIcon} alt="" />
              </div>
              <div className="size-grid">
                {[
                  "XX-Small",
                  "X-Small",
                  "Small",
                  "Medium",
                  "Large",
                  "X-Large",
                  "XX-Large",
                  "3X-Large",
                  "4X-Large",
                ].map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${
                      selectedSizes.includes(size) ? "active" : ""
                    }`}
                    onClick={() => toggleSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Dress Style */}
            <div className="filter-group">
              <div className="filter-title">
                <span>Dress Style</span>
                <img src={arrowIcon} alt="" />
              </div>
              <div className="category-list">
                {["Casual", "Formal", "Party", "Gym"].map((style) => (
                  <div
                    key={style}
                    className="category-item"
                    onClick={() => toggleStyle(style)}
                  >
                    <span className={selectedStyles.includes(style) ? "bold" : ""}>
                      {style}
                    </span>
                    <img src={arrowIcon} alt="" className="arrow-right" />
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <button className="apply-filter" onClick={applyFilters}>
              Apply Filter
            </button>
            <button className="clear-filter" onClick={clearFilters}>
              Clear Filter
            </button>
          </aside>

          {/* Products Main Section */}
          <main className="shop-products">
            <div className="shop-header">
              <div className="title-area">
                <h1>Casual</h1>
                <p>
                  Showing 1-{filteredProducts.length} of {products.length} Products
                </p>
              </div>

              <div className="right-header">
                <div className="sort-area">
                  <span>Sort by:</span>
                  <button className="sort-button">
                    <b>Most Popular</b>
                    <img src={arrowIcon} alt="" />
                  </button>
                </div>

                <button
                  className="mobile-filter-trigger"
                  onClick={() => setFilterOpen(true)}
                >
                  <img src={filterIcon} alt="Filter" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <p style={{ textAlign: "center", padding: "40px" }}>
                Server se products load ho rahe hain...
              </p>
            ) : (
              <div className="shop-product-grid">
                {filteredProducts.length === 0 ? (
                  <div className="no-products">No products found.</div>
                ) : (
                  filteredProducts.map((product) => {
                    const productId = product._id || product.id;
                    return (
                      <div
                        className="shop-product-card"
                        key={productId}
                        onClick={() => handleProductClick(productId)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="shop-product-image">
                          <img src={product.image} alt={product.name} />
                        </div>

                        <h3>{product.name}</h3>

                        <div className="shop-rating">
                          <span>
                            {"★".repeat(Math.floor(product.rating || 5))}
                            {"☆".repeat(5 - Math.floor(product.rating || 5))}
                          </span>
                          <small>{product.rating || "5.0"}/5</small>
                        </div>

                        <div className="shop-price-row">
                          <span className="shop-price">${product.price}</span>
                          {product.oldPrice && (
                            <span className="shop-old-price">
                              ${product.oldPrice}
                            </span>
                          )}
                          {product.discount && (
                            <span className="shop-discount">
                              {product.discount}
                            </span>
                          )}
                        </div>

                        <button
                          className="quick-add-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            requestAddToCart(
                              { id: productId, name: product.name, price: product.price, image: product.image },
                              { quantity: 1 }
                            );
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Pagination */}
            <div className="pagination">
              <button className="page-nav-btn">Previous</button>
              <div className="page-numbers">
                <button className="active-page">1</button>
                <button>2</button>
                <button>3</button>
                <span>...</span>
                <button>8</button>
                <button>9</button>
                <button>10</button>
              </div>
              <button className="page-nav-btn">Next</button>
            </div>
          </main>
        </div>
      </div>

      {customerDetailsModal}
      <Footer />
    </>
  );
}

export default Shop;