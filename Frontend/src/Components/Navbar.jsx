import React from "react";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black text-white font-medium tracking-wide uppercase">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Left: Logo */}
        <div className="text-lg font-semibold tracking-widest">T E C H H U B</div>

        {/* Center: Categories */}
        <div className="hidden md:flex space-x-8 text-sm">
            <Link to="laptop" className="hover:underline">Laptop</Link>
          <a href="#" className="hover:underline">Desktop</a>
          <a href="#" className="hover:underline">Monitor</a>
          <a href="#" className="hover:underline">Accessori</a>

          <a href="#" className="hover:underline">About</a>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center gap-1 hover:text-gray-300 cursor-pointer">
            <FiUser size={16} />
            <span>Login</span>
          </div>
          <div className="flex items-center gap-1 hover:text-gray-300 cursor-pointer">
            <FaGlobe size={16} />
            <span>EN/EN</span>
          </div>
          <div className="flex items-center gap-1 hover:text-gray-300 cursor-pointer">
            <FiShoppingCart size={16} />
            <span>Cart</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
