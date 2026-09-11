import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import YouMightAlsoLike from "../YouMightAlsoLike/YouMightAlsoLike";
import ProductReviews from "../ProductReviews/ProductReviews";
import TopBar from "../TopBar/TopBar";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import StickyAddToCart from "../StickyAddToCart/StickyAddToCart";
import { useAddToCart } from "../../hooks/useAddToCart";
import { isAdminProductId, fetchAdminProductById } from "../../utils/adminProductsBridge";

import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const { requestAddToCart, customerDetailsModal } = useAddToCart();

  // Server se product-details ka data fetch krna — agar id Admin dashboard
  // ke product ki hai (id "admin-" se start hoti hai) to seedha admin
  // backend se lete hain, warna purane storefront backend se, jaisa pehle
  // hota tha.
  useEffect(() => {
    setLoading(true);

    async function loadProduct() {
      if (isAdminProductId(id)) {
        return fetchAdminProductById(id);
      }

      try {
        const res = await fetch(
          `https://dashboard-backend-beta-orpin.vercel.app/api/products/${id}`
        );
        if (res.ok) return await res.json();
      } catch (err) {
        console.error("Fetch product error:", err);
      }

      // Not found on the main backend — last-chance check in case this is
      // actually an admin product linked to without its "admin-" prefix.
      return fetchAdminProductById(`admin-${id}`);
    }

    loadProduct()
      .then((data) => {
        if (!data) {
          setLoading(false);
          return;
        }
        setProduct(data);
        setMainImage(data.image);

        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }

        if (data && (data.id || data._id)) {
          const recent = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
          const currentId = data.id || data._id;
          const filteredRecent = recent.filter(
            (item) => String(item.id || item._id) !== String(currentId)
          );
          const updatedRecent = [data, ...filteredRecent].slice(0, 8);
          localStorage.setItem("recentlyViewed", JSON.stringify(updatedRecent));
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch product error:", err);
        setLoading(false);
      });
  }, [id]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!product) return;

    requestAddToCart(
      { id: product.id || product._id, name: product.name, price: product.price, image: mainImage || product.image },
      { size: selectedSize, color: selectedColor, quantity }
    );
  };

  if (loading) {
    return (
      <>
        <TopBar />
        <Navbar />
        <div style={{ textAlign: "center", padding: "80px", fontSize: "18px" }}>
          Loading Product Details...
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <TopBar />
        <Navbar />
        <div style={{ textAlign: "center", padding: "80px" }}>
          <h2>Product Not Found</h2>
          <button
            onClick={() => navigate("/shop")}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: "20px",
              border: "none",
              backgroundColor: "black",
              color: "white",
            }}
          >
            Back to Shop
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const rawGallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image, product.image, product.image];

  const galleryImages = rawGallery.slice(0, 3);

  const colorsList =
    product.colors && product.colors.length > 1
      ? product.colors
      : ["#4F533E", "#314F4A", "#31344F"];
  const sizesList = product.sizes || ["Small", "Medium", "Large", "X-Large"];

  return (
    <>
      <TopBar />
      <Navbar />

      <div className="product-detail">
        <div className="breadcrumb">
          <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            Home
          </span>
          <span>&gt;</span>
          <span onClick={() => navigate("/shop")} style={{ cursor: "pointer" }}>
            Shop
          </span>
          <span>&gt;</span>
          <span>Casual</span>
          <span>&gt;</span>
          <span className="breadcrumb-active">{product.name}</span>
        </div>


        <div className="product-detail-content">

          <div className="product-images">
            <div className="thumbnail-list">
              {galleryImages.map((imgUrl, index) => (
                <div
                  className={`thumbnail ${mainImage === imgUrl ? "active-thumbnail" : ""
                    }`}
                  key={index}
                  onClick={() => setMainImage(imgUrl)}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="main-product-image">
              <img src={mainImage} alt={product.name} />
            </div>
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>

            <div className="product-rating">
              <span style={{ color: "#FFC107" }}>
                {"★".repeat(Math.floor(product.rating || 5))}
              </span>
              <small>{product.rating || "5.0"}/5</small>
            </div>

            <div className="product-price">
              <span className="current-price">${product.price}</span>
              {product.oldPrice && (
                <span className="old-price">${product.oldPrice}</span>
              )}
              {product.discount && (
                <span className="discount">{product.discount}</span>
              )}
            </div>

            <p className="product-description">
              {product.description ||
                "This graphic t-shirt is perfect for any occasion. Crafted from soft and breathable fabric, it offers superior comfort and style."}
            </p>

            <div className="product-option">
              <h4>Select Colors</h4>
              <div className="colors">
                {colorsList.map((col, idx) => (
                  <button
                    key={idx}
                    className={`color-btn ${selectedColor === col ? "selected-color" : ""
                      }`}
                    style={{
                      backgroundColor: col,
                      width: "37px",
                      height: "37px",
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                    onClick={() => setSelectedColor(col)}
                  >
                    {selectedColor === col && (
                      <span className="color-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>


            <div className="product-option">
              <h4>Choose Size</h4>
              <div className="sizes">
                {sizesList.map((sz, idx) => (
                  <button
                    key={idx}
                    className={selectedSize === sz ? "selected-size" : ""}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-actions">
              <div className="quantity">
                <button onClick={handleDecrease}>-</button>
                <span>{quantity}</span>
                <button onClick={handleIncrease}>+</button>
              </div>

              <button className="add-cart" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProductReviews />
      <YouMightAlsoLike />


      <StickyAddToCart product={product} onAddToCart={handleAddToCart} />

      {customerDetailsModal}
      <Footer />
    </>
  );
}

export default ProductDetail;