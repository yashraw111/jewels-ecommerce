import React, { useEffect, useState, Suspense, lazy } from "react";
import "./App.css";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import SupportChatWidget from "./components/SupportChatWidget"; // 👈 विजेट को इम्पोर्ट करें

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const AllProduct = lazy(() => import("./pages/AllProduct"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Category = lazy(() => import("./pages/Category"));
const About = lazy(() => import("./pages/About"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/SignUp"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const CategoryProducts = lazy(() => import("./components/CategoryProducts"));
const ViewWishlist = lazy(() => import("./pages/ViewWishlist"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const FAQs = lazy(() => import("./pages/FAQs"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));

// Loader while route is changing
const Loader = ({ show }) => {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center 
        bg-white transition-opacity duration-700 
        ${show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 border-solid"></div>
    </div>
  );
};

// Fallback for lazy-loaded components
const PageFallback = () => (
  <div className="flex items-center justify-center h-screen text-xl font-semibold">
    Loading page...
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const hideLayoutOn = ["/login", "/signup"];
  const shouldHide = hideLayoutOn.includes(location.pathname);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      <Loader show={loading} />
      {!shouldHide && <Header />}

      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProduct />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category" element={<Category />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cartPage" element={<CartPage />} />
          <Route path="/order-success" element={<TrackOrder />} />
          <Route path="/categoryPr/:id" element={<CategoryProducts />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wishList" element={<ViewWishlist />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/faqs" element={<FAQs />} />
        </Routes>
      </Suspense>

      {!shouldHide && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
      <SupportChatWidget /> {/* 👈 विजेट को यहाँ जोड़ें */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
};

export default App;
