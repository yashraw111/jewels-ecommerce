import React from 'react';
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
const AppContent = () => {
  const location = useLocation();
  const hideLayoutOn = ['/login', '/signup'];
  const shouldHide = hideLayoutOn.includes(location.pathname);

  return (
    <>
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
