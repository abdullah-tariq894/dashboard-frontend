import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminProducts } from "../../utils/adminProductsBridge";
import "./YouMightAlsoLike.css";

function YouMightAlsoLike() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const mainFetch = fetch("https://dashboard-backend-beta-orpin.vercel.app/api/products")
      .then((res) => res.json())
      .catch((err) => {
        console.error("You Might Also Like Fetch Error:", err);
        return [];
      });

    Promise.all([mainFetch, fetchAdminProducts()]).then(
      ([mainProducts, adminProducts]) => {
        if (cancelled) return;
        const base = Array.isArray(mainProducts) ? mainProducts : [];
        const combined = [...adminProducts.slice().reverse(), ...base];
        setProducts(
          combined.slice(4, 8).length > 0 ? combined.slice(4, 8) : combined.slice(0, 4)
        );
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <p style={{ textAlign: "center", padding: "20px" }}>
        Loading Suggestions...
      </p>
    );
  }

  return (
    <section className="new-arrivals">
      <h2 className="section-title">YOU MIGHT ALSO LIKE</h2>

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
            </div>
          );
        })}
      </div>

      <button className="view-all" onClick={() => navigate("/shop")}>
        View All
      </button>
    </section>
  );
}

export default YouMightAlsoLike;