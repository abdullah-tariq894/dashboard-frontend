import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import "./Footer.css";

import visaLogo from "../../assets/visa.png";
import mastercardLogo from "../../assets/mastercard.png";
import paypalLogo from "../../assets/paypal.png";
import applePayLogo from "../../assets/apple-pay.png";
import googlePayLogo from "../../assets/google-pay.png";

function Footer() {
  return (
    <footer className="footer">

      {/* Newsletter */}

      <div className="newsletter">

        <h2>
          STAY UPTO DATE ABOUT
          <br />
          OUR LATEST OFFERS
        </h2>

        <div className="newsletter-form">

          <div className="email-box">
            <FiMail />

            <input
              type="email"
              placeholder="Enter your email address"
            />
          </div>

          <button>
            Subscribe to Newsletter
          </button>

        </div>

      </div>


      {/* Footer Content */}

      <div className="footer-content">

        <div className="footer-shop">

          <h3>SHOP.CO</h3>

          <p>
            We have clothes that suits your style and
            which you're proud to wear. From women to
            men.
          </p>

          <div className="social-icons">

            <a href="#">
              <FaTwitter />
            </a>

            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaGithub />
            </a>

          </div>

        </div>


        <div className="footer-column">

          <h4>COMPANY</h4>

          <a href="#">About</a>
          <a href="#">Features</a>
          <a href="#">Works</a>
          <a href="#">Career</a>

        </div>


        <div className="footer-column">

          <h4>HELP</h4>

          <a href="#">Customer Support</a>
          <a href="#">Delivery Details</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Privacy Policy</a>

        </div>


        <div className="footer-column">

          <h4>FAQ</h4>

          <a href="#">Account</a>
          <a href="#">Manage Deliveries</a>
          <a href="#">Orders</a>
          <a href="#">Payments</a>

        </div>


        <div className="footer-column">

          <h4>RESOURCES</h4>

          <a href="#">Free eBooks</a>
          <a href="#">Development Tutorial</a>
          <a href="#">How to - Blog</a>
          <a href="#">Youtube Playlist</a>

        </div>

      </div>


      {/* Bottom */}

      <div className="footer-bottom">

        <p>
          Shop.co © 2000-2023, All Rights Reserved
        </p>

       <div className="payment-methods">

        <div className="payment-card">
          <img src={visaLogo} alt="Visa" />
        </div>
        <div className="payment-card">
          <img src={mastercardLogo} alt="Mastercard" />
        </div>
        <div className="payment-card">
          <img src={paypalLogo} alt="PayPal" />
        </div>
        <div className="payment-card">
          <img src={applePayLogo} alt="Apple Pay" />
        </div>
        <div className="payment-card">
          <img src={googlePayLogo} alt="Google Pay" />
        </div>
      </div>

      </div>

    </footer>
  );
}

export default Footer;