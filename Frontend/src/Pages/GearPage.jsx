import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GearPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category_id: 4, // Accessory category (change this to your actual category ID)
    brand_id: '',
    min_price: '',
    max_price: '',
    search: ''
  });

  // Fetch products and brands on component mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch brands first
        const brandsResponse = await axios.get('http://localhost:4000/api/products/all/brands');
        setBrands(Array.isArray(brandsResponse.data) ? brandsResponse.data : []);

        // Then fetch products with filters
        const params = new URLSearchParams();
        for (const key in filters) {
          if (filters[key] !== '' && filters[key] !== null) {
            params.append(key, filters[key]);
          }
        }

        const productsResponse = await axios.get(`http://localhost:4000/api/products?${params.toString()}`);
        setProducts(Array.isArray(productsResponse.data) ? productsResponse.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category_id: 4, // Accessory category
      brand_id: '',
      min_price: '',
      max_price: '',
      search: ''
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="w-full md:w-1/4 lg:w-1/5">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button 
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Reset All
              </button>
            </div>
            
            {/* Search Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Brand Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <select
                name="brand_id"
                value={filters.brand_id}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand.brand_id} value={brand.brand_id}>
                    {brand.brand_name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="min_price"
                  value={filters.min_price}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="max_price"
                  value={filters.max_price}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Listing */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Accessories</h1>
                <p className="text-gray-600">{products.length} products found</p>
              </div>
              
              {products.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                  <p className="text-gray-600">No products match your filters. Try adjusting your search criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (
                    <div key={product.products_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="p-4">
                        <div className="h-48 flex items-center justify-center bg-gray-100 mb-4">
                          {product.image_urls?.[0] ? (
                            <img 
                              src={product.image_urls[0]} 
                              alt={product.name} 
                              className="h-full object-contain"
                              onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                              }}
                            />
                          ) : (
                            <img 
                              src="https://via.placeholder.com/300?text=No+Image" 
                              alt="No product image" 
                              className="h-full object-contain"
                            />
                          )}
                        </div>
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
                        <p className="text-blue-600 font-bold text-xl mb-2">${Number(product.price || 0).toFixed(2)}</p>
                        
                        {/* Quick specs preview */}
                        <div className="text-sm text-gray-600 mb-3 space-y-1">
                          {product.specifications?.processor && (
                            <p className="truncate">CPU: {product.specifications.processor}</p>
                          )}
                          {product.specifications?.ram && (
                            <p>RAM: {product.specifications.ram}</p>
                          )}
                          {product.specifications?.storage && (
                            <p className="truncate">Storage: {product.specifications.storage}</p>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{product.brand_name}</span>
                          <button onClick={() => navigate(`/products/${product.products_id}`)} 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GearPage;
