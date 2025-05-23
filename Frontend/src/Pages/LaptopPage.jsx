import React, { useState, useEffect } from 'react';
import { Filter, Star, ShoppingCart, Loader, X } from 'lucide-react';

const LaptopPage = () => {
  const [laptops, setLaptops] = useState([]);
  const [brands, setBrands] = useState([]);
  const [useForOptions, setUseForOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 5000,
    selectedBrands: [],
    selectedUseFor: [],
    sortBy: 'created_at_desc',
    search: ''
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters
        const params = new URLSearchParams({
          category_id: '1', // Laptops category
          limit: '100',
          offset: '0'
        });

        // Add filters to params
        if (filters.minPrice > 0) params.append('min_price', filters.minPrice);
        if (filters.maxPrice < 5000) params.append('max_price', filters.maxPrice);
        if (filters.selectedBrands.length > 0) {
          params.append('brand_id', filters.selectedBrands.join(','));
        }
        if (filters.selectedUseFor.length > 0) {
          params.append('use_for', filters.selectedUseFor.join(','));
        }
        if (filters.search.trim()) params.append('search', filters.search.trim());

        // Add sorting - this needs to be handled in your backend
        // For now, we'll sort on frontend
        
        console.log('Fetching with params:', params.toString());

        // Fetch brands first
        const brandsRes = await fetch('http://localhost:4000/api/products/all/brands')
          .then(res => {
            if (!res.ok) throw new Error(`Brands API error: ${res.status}`);
            return res.json();
          });

        console.log('Brands fetched successfully:', brandsRes);

        // Then fetch laptops with detailed error handling
        const laptopsRes = await fetch(`http://localhost:4000/api/products?${params.toString()}`)
          .then(async res => {
            console.log('Products API response status:', res.status);
            const text = await res.text();
            console.log('Products API raw response:', text);
            
            if (!res.ok) {
              throw new Error(`Products API error: ${res.status} - ${text}`);
            }
            
            try {
              return JSON.parse(text);
            } catch (parseError) {
              console.error('Failed to parse JSON:', parseError);
              throw new Error('Invalid JSON response from products API');
            }
          });

        console.log('API Responses:', { brandsRes, laptopsRes });

        // Handle brands response
        const brandsData = Array.isArray(brandsRes) ? brandsRes : [];

        // Handle laptops response
        const laptopsData = Array.isArray(laptopsRes) 
          ? laptopsRes 
          : Array.isArray(laptopsRes?.data) 
            ? laptopsRes.data 
            : [];

        // Sort laptops based on sortBy filter
        const sortedLaptops = sortLaptops(laptopsData, filters.sortBy);

        // Extract unique use_for options from laptops
        const allUseFor = laptopsData.reduce((acc, laptop) => {
          if (laptop?.use_for) {
            // Handle both string and array formats
            let useForArray = [];
            if (typeof laptop.use_for === 'string') {
              try {
                useForArray = JSON.parse(laptop.use_for);
              } catch {
                useForArray = [laptop.use_for];
              }
            } else if (Array.isArray(laptop.use_for)) {
              useForArray = laptop.use_for;
            }
            return [...acc, ...useForArray];
          }
          return acc;
        }, []);
        
        const uniqueUseFor = [...new Set(allUseFor)].filter(Boolean);

        setBrands(brandsData);
        setUseForOptions(uniqueUseFor);
        setLaptops(sortedLaptops);

      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  // Sort function
  const sortLaptops = (laptops, sortBy) => {
    const sorted = [...laptops];
    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price_desc':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'name_asc':
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'created_at_desc':
      default:
        return sorted.sort((a, b) => {
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateB - dateA;
        });
    }
  };

  const handlePriceChange = (min, max) => {
    setFilters(prev => ({ 
      ...prev, 
      minPrice: Math.max(0, parseInt(min) || 0),
      maxPrice: Math.min(5000, parseInt(max) || 5000)
    }));
  };

  const toggleBrandFilter = (brandId) => {
    setFilters(prev => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brandId)
        ? prev.selectedBrands.filter(id => id !== brandId)
        : [...prev.selectedBrands, brandId]
    }));
  };

  const toggleUseForFilter = (useFor) => {
    setFilters(prev => ({
      ...prev,
      selectedUseFor: prev.selectedUseFor.includes(useFor)
        ? prev.selectedUseFor.filter(uf => uf !== useFor)
        : [...prev.selectedUseFor, useFor]
    }));
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value }));
  };

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 5000,
      selectedBrands: [],
      selectedUseFor: [],
      sortBy: 'created_at_desc',
      search: ''
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-4xl text-blue-600" />
        <span className="ml-2">Loading laptops...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-600 mb-4">
          Error loading laptops: {error}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">LAPTOPS</h1>
          <p className="text-gray-300 mt-2">
            {laptops.length} models available
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white py-4 px-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search laptops..."
              value={filters.search}
              onChange={handleSearch}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at_desc">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 bg-white p-6 rounded-lg shadow h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center">
              <Filter className="mr-2" size={20} /> FILTERS
            </h2>
            <button 
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Reset All
            </button>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handlePriceChange(e.target.value, filters.maxPrice)}
                className="w-1/2 border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="Min"
              />
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange(filters.minPrice, e.target.value)}
                className="w-1/2 border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                max="5000"
                placeholder="Max"
              />
            </div>
            <div className="text-xs text-gray-500">
              ${filters.minPrice} - ${filters.maxPrice}
            </div>
          </div>

          {/* Brand Filter */}
          {brands.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Brands ({brands.length})</h3>
              <div className="max-h-48 overflow-y-auto">
                {brands.map((brand) => (
                  <div key={brand.brand_id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`brand-${brand.brand_id}`}
                      checked={filters.selectedBrands.includes(brand.brand_id)}
                      onChange={() => toggleBrandFilter(brand.brand_id)}
                      className="mr-2"
                    />
                    <label htmlFor={`brand-${brand.brand_id}`} className="text-sm cursor-pointer">
                      {brand.brand_name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Use For Filter */}
          {useForOptions.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Use For ({useForOptions.length})</h3>
              <div className="max-h-48 overflow-y-auto">
                {useForOptions.map((useFor) => (
                  <div key={useFor} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`useFor-${useFor}`}
                      checked={filters.selectedUseFor.includes(useFor)}
                      onChange={() => toggleUseForFilter(useFor)}
                      className="mr-2"
                    />
                    <label htmlFor={`useFor-${useFor}`} className="capitalize text-sm cursor-pointer">
                      {useFor}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Product Count */}
          <div className="mb-6 text-gray-600">
            Showing {laptops.length} products
          </div>

          {/* Product Cards */}
          {laptops.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {laptops.map((laptop) => (
                <LaptopCard key={laptop.products_id} laptop={laptop} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <X className="mx-auto text-4xl text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-medium mb-2">No laptops found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search term
              </p>
              <button
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-800"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LaptopCard = ({ laptop }) => {
  // Handle image URLs - they might be stored as JSON string
  const getImageUrl = () => {
    if (!laptop.image_urls) return '/api/placeholder/300/200';
    
    let imageUrls = laptop.image_urls;
    if (typeof imageUrls === 'string') {
      try {
        imageUrls = JSON.parse(imageUrls);
      } catch {
        return '/api/placeholder/300/200';
      }
    }
    
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      return imageUrls[0];
    }
    
    return '/api/placeholder/300/200';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={getImageUrl()}
          alt={laptop.name || 'Laptop'}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/api/placeholder/300/200';
          }}
        />
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        {/* Name and Brand */}
        <div className="mb-2">
          <h3 className="font-bold text-lg line-clamp-2">
            {laptop.name || 'Unnamed Laptop'}
          </h3>
          <p className="text-gray-600 text-sm">
            {laptop.brand_name || 'Unknown Brand'}
          </p>
        </div>
        
        {/* Description */}
        {laptop.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {laptop.description}
          </p>
        )}
        
        {/* Price and Add to Cart */}
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-lg text-green-600">
            ${laptop.price ? Number(laptop.price).toLocaleString() : 'N/A'}
          </span>
          <button 
            className="bg-black text-white px-4 py-2 rounded flex items-center hover:bg-gray-800 transition-colors duration-200"
            onClick={() => console.log('Add to cart:', laptop.products_id)}
          >
            <ShoppingCart className="mr-2" size={16} />
            Add to Cart
          </button>
        </div>
        
        {/* Stock Status */}
        {laptop.stock_quantity !== undefined && (
          <div className="mt-2 text-xs">
            {laptop.stock_quantity > 0 ? (
              <span className="text-green-600">In Stock ({laptop.stock_quantity})</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LaptopPage;