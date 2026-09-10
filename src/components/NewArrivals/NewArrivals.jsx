import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddToCart } from "../../hooks/useAddToCart";
import { fetchAdminProducts } from "../../utils/adminProductsBridge";
import "./NewArrivals.css";

function NewArrivals() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { requestAddToCart, customerDetailsModal } = useAddToCart();

  // Server se New Arrivals ka data lena — main storefront backend ke saath
  // Admin dashboard se add kiye gaye products bhi merge karke dikhate hain,
  // bina main backend ko chhede.
  useEffect(() => {
    let cancelled = false;

    const mainFetch = fetch(
      "https://shop-co-backend-sigma.vercel.app/api/products/new-arrivals"
    )
      .then((res) => res.json())
      .catch((err) => {
        console.error("New Arrivals fetch karne mein error aaya:", err);
        return [];
      });

    Promise.all([mainFetch, fetchAdminProducts()]).then(
      ([mainProducts, adminProducts]) => {
        if (cancelled) return;
        const base = Array.isArray(mainProducts) ? mainProducts : [];
        // Newest admin products first, so a freshly added item actually
        // shows up as a "new arrival" instead of getting buried.
        setProducts([...adminProducts.slice().reverse(), ...base]);
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  // Product Click Handler with Instant Top Scroll
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    window.scrollTo(0, 0); // Directly detail page ke top par scroll karega
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", padding: "40px" }}>
        Products load ho rahe hain...
      </p>
    );
  }

  return (
    <section className="new-arrivals">
      <h2 className="section-title">NEW ARRIVALS</h2>

      <div className="products">
        {products.map((product) => {
          const productId = product._id || product.id;
          return (
            <div
              className="product-card"
              key={productId}
              onClick={() => handleProductClick(productId)}
              style={{ cursor: "pointer" }}
            >
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>

              <h3>{product.name}</h3>

              <div className="rating">
                <span>{"★".repeat(Math.floor(product.rating || 5))}</span>
                <small>{product.rating || "5.0"}/5</small>
              </div>

              {product.oldPrice ? (
                <div className="price-row">
                  <p className="price">${product.price}</p>
                  <p className="old-price">${product.oldPrice}</p>
                  <span className="discount">{product.discount}</span>
                </div>
              ) : (
                <p className="price">${product.price}</p>
              )}

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

      <button className="view-all" onClick={() => navigate("/shop?category=new")}>
        View All
      </button>
      {customerDetailsModal}
    </section>
  );
}

export default NewArrivals;