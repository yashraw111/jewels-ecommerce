import { Heart, Menu, Search, ShoppingCart, User } from "lucide-react";
import React, { useState } from "react";
import logo from "../assets/images/logo.png";
import Container from "./Container";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../redux/UserSlice";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(removeUser());
    toast.success("Logout successful");
  };

  // Menu Link Style Function
  const navLinkClass = ({ isActive }) =>
    `relative transition-all duration-300 hover:text-purple-600 ${
      isActive ? "text-purple-600 font-semibold" : "text-black"
    }`;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-purple-600 text-white text-sm">
        <Container>
          <div className="px-4 mx-auto py-3 flex justify-between items-center">
            <span>Free shipping on all orders above $499</span>
            <div className="hidden sm:flex gap-4">
              <span>+91 83000 83000</span>
              <span>kukujewel@gmail.com</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Header */}
      <header className="bg-white shadow-md relative z-50">
        <Container>
          <div className="mx-auto px-4 py-5 flex justify-between items-center">
            {/* Logo */}
            <div>
              <h1 className="text-black font-extrabold text-3xl">KUKU</h1>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/products" className={navLinkClass}>
                All Product
              </NavLink>
              <NavLink to="/category" className={navLinkClass}>
                Category
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                About us
              </NavLink>
              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>
            </nav>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-3 relative">
              {/* Search Icon */}
              <div
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 cursor-pointer transform transition-transform duration-300 hover:scale-110"
              >
                <Search size={18} className="text-white" />
              </div>

              {/* Search Input */}
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search..."
                  className="absolute top-full mt-2 right-0 w-64 border p-2 rounded bg-white shadow z-50 text-black"
                  autoFocus
                />
              )}

              {/* Cart */}
              <div className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 cursor-pointer transform transition-transform duration-300 hover:scale-110">
                <NavLink to="/cartPage">
                  <ShoppingCart size={18} className="text-white" />
                </NavLink>
              </div>

              {/* Wishlist */}
              <div className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 cursor-pointer transform transition-transform duration-300 hover:scale-110">
                <Heart size={18} className="text-white" />
              </div>

              {/* User Dropdown */}
              {user ? (
                <div className="relative">
                  <div
                    className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 cursor-pointer transform transition-transform duration-300 hover:scale-110"
                    onClick={() => setShowUserDropdown((prev) => !prev)}
                  >
                    <User size={18} className="text-white" />
                  </div>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 bg-white shadow-md rounded w-40 text-sm text-black z-50">
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Profile
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <NavLink
                    to="/login"
                    className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="px-4 py-1 border border-purple-600 text-purple-600 rounded hover:bg-purple-600 hover:text-white"
                  >
                    Register
                  </NavLink>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <label
                htmlFor="mobile-menu"
                className="cursor-pointer text-purple-600"
              >
                <Menu />
              </label>
            </div>
          </div>

          {/* Mobile Menu */}
          <input type="checkbox" id="mobile-menu" className="peer hidden" />
          <div className="peer-checked:block hidden md:hidden bg-white">
            <div className="mx-auto px-4 pb-4 text-black font-medium">
              <nav className="flex flex-col gap-3">
                <NavLink to="/" className={navLinkClass}>
                  Home
                </NavLink>
                <NavLink to="/products" className={navLinkClass}>
                  All Product
                </NavLink>
                <NavLink to="/category" className={navLinkClass}>
                  Category
                </NavLink>
                <NavLink to="/about" className={navLinkClass}>
                  About us
                </NavLink>
                <NavLink to="/contact" className={navLinkClass}>
                  Contact
                </NavLink>
              </nav>

              {/* Mobile Icons */}
              <div className="mt-4 flex gap-4 text-purple-600">
                <div className="p-2 bg-purple-100 rounded-full hover:bg-purple-200 cursor-pointer transition-transform duration-300 hover:scale-110">
                  <Search size={18} />
                </div>
                <div className="p-2 bg-purple-100 rounded-full hover:bg-purple-200 cursor-pointer transition-transform duration-300 hover:scale-110">
                  <NavLink to="/cartPage">
                    <ShoppingCart size={18} />
                  </NavLink>
                </div>
                <div className="p-2 bg-purple-100 rounded-full hover:bg-purple-200 cursor-pointer transition-transform duration-300 hover:scale-110">
                  <Heart size={18} />
                </div>
                <div className="p-2 bg-purple-100 rounded-full hover:bg-purple-200 cursor-pointer transition-transform duration-300 hover:scale-110">
                  <User size={18} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </header>
    </>
  );
};

export default Header;
