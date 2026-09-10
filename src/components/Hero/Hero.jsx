import "./Hero.css";
import heroImage from "../../assets/hero-models.jpg";
import starIcon from "../../assets/black-star.png"; 

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        
    
        <div className="hero-content">
          <h1 className="hero-title">
            FIND CLOTHES<br />
            THAT MATCHES<br />
            YOUR STYLE
          </h1>

          <p className="hero-desc">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of style.
          </p>

          <button className="hero-btn">Shop Now</button>

          <div className="hero-stats">
            <div className="stat-item">
              <h2>200+</h2>
              <p>International Brands</p>
            </div>
            
            <div className="stat-line"></div>

            <div className="stat-item">
              <h2>2,000+</h2>
              <p>High-Quality Products</p>
            </div>

            <div className="stat-line"></div>

            <div className="stat-item">
              <h2>30,000+</h2>
              <p>Happy Customers</p>
            </div>
          </div>
        </div>

        {/* Right Side Image Block */}
        <div className="hero-image-box">
          <img src={heroImage} alt="Fashion Models" className="hero-img" />
          
          {/* Black Stars */}
          <img src={starIcon} alt="star" className="star star-big" />
          <img src={starIcon} alt="star" className="star star-small" />
        </div>

      </div>
    </section>
  );
}

export default Hero;