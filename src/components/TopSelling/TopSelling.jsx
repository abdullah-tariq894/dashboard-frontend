import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddToCart } from "../../hooks/useAddToCart";
import { fetchAdminProducts } from "../../utils/adminProductsBridge";
import "./TopSelling.css";

function TopSelling() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { requestAddToCart, customerDetailsModal } = useAddToCart();

  // Main backend ke top-selling products + Admin dashboard ke naye
  // products, dono merge karke.
  useEffect(() => {
    let cancelled = false;

    const mainFetch = fetch(
      "https://dashboard-backend-beta-orpin.vercel.app/api/products/top-selling"
    )
      .then((res) => res.json())
      .catch((err) => {
        console.error("Top Selling Fetch Error:", err);
        return [];
      });

    Promise.all([mainFetch, fetchAdminProducts()]).then(
      ([mainProducts, adminProducts]) => {
        if (cancelled) return;
        const base = Array.isArray(mainProducts) ? mainProducts : [];
        setProducts([...adminProducts.slice().reverse(), ...base].slice(0, 4));
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <p style={{ textAlign: "center", padding: "40px" }}>
        Loading Top Selling...
      </p>
    );
  }

  return (
    <section className="new-arrivals top-selling-section">
      <h2 className="section-title">TOP SELLING</h2>

      <div className="products">
        {products.map((product) => {
          const productId = product.id || product._id;
          return (
            <div
              className="product-card"
              key={productId}
              onClick={() => {
                navigate(`/product/${productId}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>

              <h3>{product.name}</h3>

              <div className="rating">
                <span style={{ color: "#FFC107" }}>
                  {"★".repeat(Math.floor(product.rating || 5))}
                </span>
                <small>{product.rating || "5.0"}/5</small>
              </div>

              <div className="price-row">
                <p className="price">${product.price}</p>
                {product.oldPrice && (
                  <p className="old-price">${product.oldPrice}</p>
                )}
                {product.discount && (
                  <span className="discount">{product.discount}</span>
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
        })}
      </div>

      <button className="view-all" onClick={() => navigate("/shop")}>
        View All
      </button>
      {customerDetailsModal}
    </section>
  );
}

export default TopSelling;