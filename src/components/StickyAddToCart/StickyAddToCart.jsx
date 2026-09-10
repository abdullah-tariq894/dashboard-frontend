import { useState, useEffect } from "react";
import { IoCartOutline } from "react-icons/io5";
import "./StickyAddToCart.css";

function StickyAddToCart({ product, onAddToCart }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible || !product) return null;

  return (
    <div className="sticky-cart-bar">
      <div className="sticky-cart-content">
        <div className="sticky-product-info">
          <img 
            src={product.image || product.images?.[0] || "/placeholder.png"} 
            alt={product.name} 
          />
          <div>
            <h4>{product.name}</h4>
            <p className="sticky-price">${product.price}</p>
          </div>
        </div>

        <button className="sticky-add-btn" onClick={onAddToCart}>
          <IoCartOutline /> Add to Cart
        </button>
      </div>
    </div>
  );
}

export default StickyAddToCart;