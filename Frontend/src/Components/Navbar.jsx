import React, { useState } from "react";
import { FiShoppingCart, FiUser, FiChevronDown, FiChevronUp, FiLogOut, FiSettings } from "react-icons/fi";
import { FaGlobe } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartIcon } from "../Components/CartIcon";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-black text-white font-medium tracking-wide uppercase relative">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Left: Logo */}
        <Link to={'/'}>
          <div className="text-lg font-semibold tracking-widest cursor-pointer">
            T E C H U B
          </div>
        </Link>

        {/* Center: Categories */}
        <div className="hidden md:flex space-x-8 text-sm">
          <Link to="laptop" className="hover:underline">Laptop</Link>
          <Link to="desktop" className="hover:underline">Desktop</Link>
          <Link to="monitor" className="hover:underline">Monitor</Link>
          <Link to="gear" className="hover:underline">Gear</Link>
          <Link to="about" className="hover:underline">About</Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-6 text-sm">
          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex items-center gap-1 hover:text-gray-300 cursor-pointer"
              >
                <FiUser size={16} />
                <span>Account</span>
                {isDropdownOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800 flex items-center gap-2"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FiUser size={14} />
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800 flex items-center gap-2"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FiShoppingCart size={14} />
                    My Orders
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800 flex items-center gap-2"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FiSettings size={14} />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 flex items-center gap-2"
                  >
                    <FiLogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1 hover:text-gray-300 cursor-pointer">
              <FiUser size={16} />
              <span>Login</span>
            </Link>
          )}

          <div className="flex items-center gap-1 hover:text-gray-300 cursor-pointer">
            <FaGlobe size={16} />
            <span>EN/EN</span>
          </div>
          
          <div className="flex items-center gap-1 hover:text-gray-300 cursor-pointer">
            <Link to="/cart" className="flex items-center gap-1 hover:text-gray-300 cursor-pointer">
              <CartIcon />
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;