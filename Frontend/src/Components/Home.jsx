import React from "react";
import { assets } from "../assets/assets"; 

const Home = () => {

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">

      

      {/* Main Heading */}
      <div className="text-center mb-12">

        <h1 className="text-4xl font-bold text-gray-900 pt-30 mb-4">
          TECHHUB LAPTOPS, DESKTOPS, MONITOR AND ACCESSORIES
        </h1>
      </div>

      {/* Product Categories */}
      <div className="flex justify-center gap-25 mb-16 flex-wrap">
        {[
          { name: "LAPTOP", icon: assets.laptop_logo},
          { name: "DESKTOP", icon: assets.desktop_logo },
          { name: "MONITOR", icon: assets.monitor_logo },
          { name: "ACCESSORIES", icon: assets.mouse_logo },
        ].map((category) => (
          <div
            key={category.name}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-20 h-20 mb-4 flex items-center justify-center">
              <img
                src={category.icon}
                alt={category.name}
                className="h-full object-contain group-hover:scale-110 transition-transform"
              />
            </div>
            <span className="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
              {category.name}
            </span>
          </div>
        ))}
      </div>

      {/* Featured Products Carousel */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          FEATURED PRODUCTS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            assets.macbook_1,
            assets.msi_banner,
            assets.asus_banner,
            assets.monitor_banner,
          ].map((product, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={product}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {index === 0 && "MacBook Pro"}
                  {index === 1 && "MSI Gaming Laptop"}
                  {index === 2 && "ASUS ROG Desktop"}
                  {index === 3 && "UltraWide Monitor"}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">$999.99</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Logos */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          OUR BRANDS
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            assets.apple_logo,
            assets.msi_logo,
            assets.asus_rog_logo,
            assets.acer_logo,
            assets.hp_logo,
            assets.intel_logo,
          ].map((logo, index) => (
            <div
              key={index}
              className="w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all"
            >
              <img
                src={logo}
                alt={`Brand ${index + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-900 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">READY TO UPGRADE YOUR TECH?</h2>
        <p className="text-xl mb-6">
          Explore our full range of products and find the perfect tech solution
          for your needs.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition">
          SHOP NOW
        </button>
      </div>
    </div>
  );
};

export default Home;