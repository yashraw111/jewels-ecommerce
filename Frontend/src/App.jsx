import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer';
import AllProduct from './pages/AllProduct';
import Category from './pages/Category';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CategoryProducts from './components/CategoryProducts';
import CheckoutPage from './pages/CheckoutPage';
import TrackOrder from './pages/TrackOrder';
import ViewWishlist from './pages/ViewWishlist';
// import Wishlist from './pages/Wishlist';

const Loader = ({ show }) => {
  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex items-center justify-center 
        bg-white transition-opacity duration-700 
        ${show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 border-solid"></div>
    </div>
  );
};


const AppContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const hideLayoutOn = ['/login', '/signup'];
  const shouldHide = hideLayoutOn.includes(location.pathname);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1200); // Total loading time with transition
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      <Loader show={loading} />
      {!shouldHide && <Header />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<AllProduct />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path='/category' element={<Category />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/cartPage' element={<CartPage />} />
        <Route path='/order-success' element={<TrackOrder />} />
          <Route path="/categoryPr/:id" element={<CategoryProducts />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wishList" element={<ViewWishlist />} />

      </Routes>
      {!shouldHide && <Footer />}
    </>
  );
};


const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
