import { Routes, Route } from "react-router-dom";

import TopBar from "../components/TopBar/TopBar";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Brands from "../components/Brands/Brands";
import NewArrivals from "../components/NewArrivals/NewArrivals";
import TopSelling from "../components/TopSelling/TopSelling";
import StyleSection from "../components/StyleSection/StyleSection";
import Reviews from "../components/Reviews/Reviews";
import Footer from "../components/Footer/Footer";

import ProductDetail from "../components/ProductDetail/ProductDetail";

import Shop from "../pages/Shop/Shop";
import Cart from "../pages/Cart/Cart";
import Login from "../pages/Login/Login";
import Signup from "../pages/SignUp/SignUp";

import AdminLayout from "../pages/Admin/Layout/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import AdminProducts from "../pages/Admin/Products/AdminProducts";
import AdminOrders from "../pages/Admin/Orders/AdminOrders";
import AdminCustomers from "../pages/Admin/Customers/AdminCustomers";

import AdminGate from "../components/AdminGate/AdminGate";


function AppRoutes() {
  return (
    <Routes>

      {/* Home */}

      <Route
        path="/"
        element={
          <>
            <TopBar />
            <Navbar />
            <Hero />
            <Brands />
            <NewArrivals />
            <TopSelling />
            <StyleSection />
            <Reviews />
            <Footer />
          </>
        }
      />


      {/* Product Detail */}

      <Route
        path="/product/:id"
        element={<ProductDetail />}

      />

      {/* Product Shop Paage */}
      <Route
        path="/shop"
        element={<Shop />}
      />

       {/* Product Cart Page */}
      <Route path="/cart" element={<Cart />}
      />


     {/* Login Page */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin Panel (dashboard password required) */}
      <Route
        path="/admin"
        element={
          <AdminGate>
            <AdminLayout />
          </AdminGate>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
      </Route>

    </Routes>
  );
}

export default AppRoutes;