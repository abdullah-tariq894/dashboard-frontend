import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  IoPersonOutline, 
  IoMailOutline, 
  IoLockClosedOutline, 
  IoEyeOutline, 
  IoEyeOffOutline 
} from "react-icons/io5";
import "./SignUp.css";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup submitted:", formData);
    // Backend API integration baad mein yahan hogi
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        
        {/* Left Side (Banner) */}
        <div className="signup-banner">
          <div className="banner-overlay">
            <h2>Join the Trend<br />Create Your Style</h2>
            <p>
              Sign up today and get exclusive access to new arrivals, 
              special offers, and personalised fashion recommendations with SHOP.CO.
            </p>
          </div>
        </div>

        {/* Right Side (Form Content) */}
        <div className="signup-content">
          <div className="signup-logo">
            SHOP<span>.CO</span>
          </div>

          <h1>Create Account</h1>
          <p className="signup-subtitle">
            Sign up to start shopping and exploring the latest collection
          </p>

          <form onSubmit={handleSubmit} className="signup-form">

            {/* Full Name */}
            <div className="input-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-wrapper">
                <IoPersonOutline className="input-icon" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <IoMailOutline className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <IoLockClosedOutline className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="signup-options">
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                <span>
                  I agree to the <Link to="/terms">Terms & Conditions</Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="signup-btn">
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <p className="login-redirect-text">
            Already have an account?
            <Link to="/login"> Log In</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;
