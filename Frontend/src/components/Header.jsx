/*
  File: components/Header.js
  Description: This is the updated Header component. 
  I've added logic to fetch the user's wishlist and display the item count on the wishlist icon.
*/

import { Heart, Menu, Search, ShoppingCart, User, X, ClipboardList } from "lucide-react";
import React, { useState, useEffect } from "react";
import Container from "./Container";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../redux/UserSlice";
import ProfileModal from "./ProfileModal";
import axios from "axios";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [refreshUser, setRefreshUser] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  
  // State to hold the wishlist items
  const [wishlist, setWishlist] = useState([]);

  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  // Calculate counts for cart and wishlist
  const cartCount = cartItems?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  // Effect to handle scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect to fetch wishlist when user logs in or data is refreshed
  useEffect(() => {
    const fetchWishlist = async () => {
      // Only fetch if there is a logged-in user
      if (user && user._id) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/wishlist/wishlist/${user._id}`
          );
          if (response.data.success) {
            setWishlist(response.data.wishlist);
          }
        } catch (error) {
          console.error("Failed to fetch wishlist", error);
          // Optionally, show a toast message, but it might be noisy
          // toast.error("Could not load your wishlist");
        }
      } else {
        // Clear wishlist when user logs out
        setWishlist([]);
      }
    };

    fetchWishlist();
    // This effect depends on the user object and the refresh trigger
  }, [user, refreshUser]);

  const handleLogout = () => {
    dispatch(removeUser());
    toast.success("Logout successful");
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `relative transition-all duration-300 hover:text-purple-600 ${
      isActive ? "text-purple-600 font-semibold" : "text-black"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block py-3 px-4 text-lg transition-all duration-300 hover:text-purple-600 ${
      isActive ? "text-purple-600 font-semibold" : "text-black"
    }`;

  const handleProfileUpdate = async (updatedData) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/auth/update-profile/${user._id}`,
        updatedData
      );
      toast.success("Profile updated successfully");
      setIsProfileModalOpen(false);
      setRefreshUser(!refreshUser);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  return (
    <>
      {/* Top banner */}
      <div className="bg-purple-600 text-white text-sm overflow-hidden">
        <Container>
          <div className="px-4 mx-auto py-3 flex items-center justify-between gap-4 relative">
            <span className="whitespace-nowrap hidden md:inline-block">
              Free shipping on all orders above $499
            </span>
            <div className="flex-1 overflow-hidden">
              <div className="whitespace-nowrap animate-[scroll_15s_linear_infinite] text-center text-xs sm:text-sm font-medium">
                💎 Limited Time Offer: Get 20% Off on All Gold Sets! ✨ Free
                Returns | 24x7 Support | COD Available 💍
              </div>
            </div>
            <div className="hidden sm:flex gap-4 text-right whitespace-nowrap">
              <span>+91 83000 83000</span>
              <span>kukujewel@gmail.com</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main header */}
      <header
        className={`bg-white shadow-md sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-lg" : ""
        }`}
      >
        <Container>
          <div className="mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-purple-600 focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            {/* Logo */}
            <div className="flex-1 md:flex-none text-center md:text-left">
              <h1 className="text-black font-extrabold text-2xl sm:text-3xl">
                KUKU
              </h1>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/products" className={navLinkClass}>All Product</NavLink>
              <NavLink to="/category" className={navLinkClass}>Category</NavLink>
              <NavLink to="/about" className={navLinkClass}>About us</NavLink>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
            </nav>

            {/* Icons and User Section */}
            <div className="flex items-center gap-3 relative">
              {/* Search Icon */}
              <div
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 cursor-pointer transform transition-transform duration-300 hover:scale-110"
              >
                <Search size={18} className="text-white" />
              </div>

              {/* Search Input */}
              {showSearch && (
                <div className="absolute top-full left-0 right-0 bg-white py-2 px-4 shadow-md z-50 md:left-auto md:right-0 md:w-64">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="flex-1 border p-2 rounded-l focus:outline-none text-black"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                      autoFocus
                    />
                    <button
                      className="bg-purple-600 text-white px-3 py-2 rounded-r hover:bg-purple-700"
                      onClick={() => {
                        if (searchQuery.trim()) {
                          toast.info(`Searching for: ${searchQuery}`);
                          setSearchQuery("");
                          setShowSearch(false);
                        }
                      }}
                    >
                      <Search size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Cart Icon */}
              <NavLink to={user && user._id ? "/cartPage" : "#"}>
                <div
                  className="relative p-2 bg-purple-600 rounded-full hover:bg-purple-700 cursor-pointer transform transition-transform duration-300 hover:scale-110"
                  onClick={(e) => {
                    if (!user || !user._id) {
                      e.preventDefault();
                      return toast.warning("Please login to view cart");
                    }
                  }}
                >
                  <ShoppingCart size={18} className="text-white" />
                  {user && user._id && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {cartCount}
                    </span>
                  )}
                </div>
              </NavLink>

              {/* Orders Icon */}
              {user && user._id && (
                <NavLink to="/order-success" className="hidden sm:block">
                  <div className="flex items-center gap-2 text-white p-2 bg-purple-600 rounded-full hover:bg-purple-700 cursor-pointer transform transition-transform duration-300 hover:scale-110">
                    <ClipboardList size={16} />
                  </div>
                </NavLink>
              )}

              {/* Wishlist Icon with Count */}
              {user && (
                <NavLink to="/wishList" className="hidden sm:block">
                  <div className="relative p-2 bg-purple-600 rounded-full hover:bg-purple-700 cursor-pointer transform transition-transform duration-300 hover:scale-110">
                    <Heart size={18} className="text-white" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                </NavLink>
              )}

              {/* User Section */}
              <div className="relative">
                <div
                  className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 cursor-pointer transform transition-transform duration-300 hover:scale-110"
                  onClick={() => setShowUserDropdown((prev) => !prev)}
                >
                  <User size={18} className="text-white" />
                </div>

                {/* Dropdown */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 bg-white shadow-md rounded w-40 text-sm text-black z-50">
                    {user && user._id ? (
                      <>
                        <NavLink
                          to="#"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setIsProfileModalOpen(true);
                            setShowUserDropdown(false);
                          }}
                        >
                          Profile
                        </NavLink>
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <NavLink
                          to="/login"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Login
                        </NavLink>
                        <NavLink
                          to="/signup"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Register
                        </NavLink>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white shadow-lg rounded-b-lg">
              <nav className="flex flex-col py-2">
                <NavLink to="/" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
                <NavLink to="/products" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>All Product</NavLink>
                <NavLink to="/category" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>Category</NavLink>
                <NavLink to="/about" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>About us</NavLink>
                <NavLink to="/contact" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
                
                {/* Mobile-only user actions */}
                {user && user._id && (
                  <>
                    <NavLink to="/order-success" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>My Orders</NavLink>
                    
                    {/* Mobile Wishlist Link with Count */}
                    <NavLink to="/wishList" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                      <div className="flex justify-between items-center">
                        <span>Wishlist</span>
                        {wishlistCount > 0 && (
                          <span className="bg-purple-600 text-white text-xs font-semibold rounded-full px-2 py-1">
                            {wishlistCount}
                          </span>
                        )}
                      </div>
                    </NavLink>
                    
                    <NavLink to="#" className={mobileNavLinkClass} onClick={() => {
                      setIsProfileModalOpen(true);
                      setMobileMenuOpen(false);
                    }}>
                      Profile
                    </NavLink>
                  </>
                )}

                {/* Mobile login/register buttons */}
                {!user && (
                  <div className="flex gap-3 px-4 py-3">
                    <NavLink to="/login" className="flex-1 text-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </NavLink>
                    <NavLink to="/signup" className="flex-1 text-center px-4 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-600 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                      Register
                    </NavLink>
                  </div>
                )}

                {/* Mobile logout button */}
                {user && user._id && (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-lg hover:bg-gray-100 text-red-600 font-medium"
                  >
                    Logout
                  </button>
                )}
              </nav>
            </div>
          )}
        </Container>
      </header>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userData={user}
        onSave={handleProfileUpdate}
      />
    </>
  );
};

export default Header;
