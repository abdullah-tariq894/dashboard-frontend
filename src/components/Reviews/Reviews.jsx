import { useRef } from "react";
import "./Reviews.css";

function Reviews() {
  const reviewsContainer = useRef(null);

  const reviews = [
    {
      name: "Sarah M.",
      text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    },
    {
      name: "Alex K.",
      text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
    },
    {
      name: "James L.",
      text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
    },
    {
      name: "Michael R.",
      text: "The quality of the products is excellent and the shopping experience is very smooth. I will definitely be ordering again.",
    },
    {
      name: "Emma S.",
      text: "I love the variety of styles available. Everything I ordered looked great and fit perfectly.",
    },
  ];

  const nextReview = () => {
    reviewsContainer.current.scrollBy({
      left: reviewsContainer.current.clientWidth / 3 + 10,
      behavior: "smooth",
    });
  };

  const previousReview = () => {
    reviewsContainer.current.scrollBy({
      left: -(reviewsContainer.current.clientWidth / 3 + 10),
      behavior: "smooth",
    });
  };

  return (
    <section className="reviews">

      <div className="reviews-header">

        <h2>OUR HAPPY CUSTOMERS</h2>

        <div className="review-buttons">

          <button onClick={previousReview}>
            ←
          </button>

          <button onClick={nextReview}>
            →
          </button>

        </div>

      </div>


      <div
        className="reviews-container"
        ref={reviewsContainer}
      >

        {reviews.map((review, index) => (
          <div className="review-card" key={index}>

            <div className="review-rating">
              ★★★★★
            </div>

            <div className="review-name">
              {review.name}

              <span>✓</span>
            </div>

            <p>
              {review.text}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Reviews;