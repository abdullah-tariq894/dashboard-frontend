
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import "./Login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend authentication mein yahan connect kruga
    console.log("Login submitted");
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Side */}
        <div className="login-content">
          <div className="login-logo">
            SHOP<span>.CO</span>
          </div>

          <h1>Welcome Back!</h1>

          <p className="login-subtitle">
            Login to your account and continue shopping with SHOP.CO
          </p>

          <form onSubmit={handleSubmit} className="login-form">

            {/* Email */}
            <div className="input-group">
              <label htmlFor="email">Email Address</label>

              <div className="input-wrapper">
                <IoMailOutline className="input-icon" />

                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <div className="password-label">
                <label htmlFor="password">Password</label>

                <Link to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <div className="input-wrapper">
                <IoLockClosedOutline className="input-icon" />

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <IoEyeOffOutline />
                  ) : (
                    <IoEyeOutline />
                  )}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
            </div>

            {/* Login Button */}
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          {/* Signup */}
          <p className="signup-text">
            Don't have an account?
            <Link to="/signup"> Sign Up</Link>
          </p>
        </div>

        {/* Right Side */}
        <div className="login-banner">
          <div className="banner-overlay">
            <h2>Find Clothes<br />That Matches Your Style</h2>

            <p>
              Discover the latest trends and build your perfect wardrobe
              with SHOP.CO.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
