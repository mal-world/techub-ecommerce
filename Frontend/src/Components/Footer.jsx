import React from "react";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">ELITE PERFORMANCE</h3>
            <p className="text-gray-400">
              Cutting-edge solutions for unparalleled performance.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">LINKS</h4>
            <ul className="space-y-2 text-gray-400">
              {["Home", "Products", "Blog", "Careers"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-blue-400 transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-semibold mb-4">SUPPORT</h4>
            <ul className="space-y-2 text-gray-400">
              {["Contact Us", "FAQ", "Shipping", "Returns"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-blue-400 transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h4 className="font-semibold mb-4">FOLLOW US</h4>
            <div className="flex space-x-4">
              {[
                { icon: <FiFacebook size={20} />, name: "Facebook" },
                { icon: <FiTwitter size={20} />, name: "Twitter" },
                { icon: <FiInstagram size={20} />, name: "Instagram" },
                { icon: <FiLinkedin size={20} />, name: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Elite Performance. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;