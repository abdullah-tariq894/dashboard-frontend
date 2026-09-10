import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductReview.css";
import filterIcon from "../../assets/sort-arrow.png";
import sortArrow from "../../assets/sort-arrow.png";

function ProductReviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`https://shop-co-backend-sigma.vercel.app/api/products/${id}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        } else {
        
          setReviews([
            {
              id: 1,
              name: "Samantha D.",
              rating: 5,
              comment: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
              date: "Posted on August 14, 2023",
            },
            {
              id: 2,
              name: "Alex M.",
              rating: 5,
              comment: "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
              date: "Posted on August 15, 2023",
            },
             {
              id: 3,
              name: "Ethan R..",
              rating: 3,
              comment: "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt.",
              date: "August 16, 2023",
            },
             {
              id: 4,
              name: "Olivia P.",
              rating: 3,
              comment:"As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out.",
              date: "August 18, 2023",
            },
          ]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch reviews error:", err);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="product-reviews">
     
      <div className="review-tabs">
        <button type="button">Product Details</button>
        <button type="button" className="active-tab">
          Rating & Reviews
        </button>
        <button type="button">FAQs</button>
      </div>

  
      <div className="reviews-top">
        <div className="reviews-title">
          <h2>All Reviews</h2>
          <span>({reviews.length})</span>
        </div>

        <div className="review-controls">
          <button
            type="button"
            className="filter-button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <img src={filterIcon} alt="filter" />
          </button>

          <div className="sort-select">
            <span>Latest</span>
            <img src={sortArrow} alt="sort" className="sort-arrow" />
          </div>

          <button type="button" className="write-review">
            Write a Review
          </button>
        </div>
      </div>


      {loading ? (
        <p style={{ textAlign: "center", padding: "30px" }}>Loading reviews...</p>
      ) : reviews.length > 0 ? (
        <div className="review-grid">
          {reviews.map((rev, index) => (
            <div className="review-box" key={rev.id || index}>
              <div className="review-card-top">
                <div className="review-stars">
                  {"★".repeat(Math.floor(rev.rating || 5))}
                </div>
                <button type="button" className="review-menu">•••</button>
              </div>

              <div className="review-user">
                <strong>{rev.name || rev.author || "User"}</strong>
                <span className="verified">✔</span>
              </div>

              <p className="review-text">
                "{rev.comment || rev.text || rev.review}"
              </p>

              <span className="review-date">
                Posted on {rev.date || "August 14, 2023"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Iss product ke abhi koi reviews nahi hain.
        </p>
      )}

      {reviews.length > 0 && (
        <button type="button" className="load-more">
          Load More Reviews
        </button>
      )}

    </div>
  );
}

export default ProductReviews;