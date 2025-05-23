import { useState, useEffect } from 'react';
import { PhotoIcon, XMarkIcon, FunnelIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Product = ({}) => {
  // List of all products
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    search: ''
  });

  // Modal open & product being edited
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category_id: categories.length > 0 ? categories[0].categories_id : '',
    brand_id: '',
    stock_quantity: 0,
    image_urls: null,
    specifications: {},
  });

  // Fetch all products, brands and categories
  useEffect(() => {
    // Fetch products
    fetch('http://localhost:4000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(console.error);

    // Fetch brands
    fetch('http://localhost:4000/api/products/all/brands')
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(console.error);

    // Fetch categories
    fetch('http://localhost:4000/api/products/all/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error);
  }, []);

  // Apply filters whenever filters or products change
  useEffect(() => {
    let result = [...products];
    
    if (filters.category) {
      result = result.filter(p => p.category_id == filters.category);
    }
    
    if (filters.brand) {
      result = result.filter(p => p.brand_id == filters.brand);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        (p.description && p.description.toLowerCase().includes(searchTerm))
      );
    }
    
    setFilteredProducts(result);
  }, [filters, products]);

  // Init form when editingProduct changes
  useEffect(() => {
    const defaultCatId = categories.length > 0 ? categories[0].categories_id : '';
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price || 0,
        category_id: editingProduct.category_id || defaultCatId,
        brand_id: editingProduct.brand_id || '',
        stock_quantity: editingProduct.stock_quantity || 0,
        image_urls: editingProduct.image_urls || [],
        specifications: editingProduct.specifications || {},
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category_id: defaultCatId,
        brand_id: '',
        stock_quantity: 0,
        image_urls: [],
        specifications: {},
      });
    }
  }, [editingProduct, JSON.stringify(categories)]);

  const openAddForm = () => {
    setEditingProduct(null);
    setIsOpen(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setIsOpen(true);
  };

  const closeForm = () => {
    setIsOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const url = e.target.value.trim();
    setFormData(prev => ({
      ...prev,
      image_urls: url ? [url] : [],
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      brand: '',
      search: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = 'http://localhost:4000/api/products';
      const url = editingProduct ? `${baseUrl}/${editingProduct.products_id}` : baseUrl;

      // Prepare the data to send
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        specifications: typeof formData.specifications === 'string' 
          ? JSON.parse(formData.specifications) 
          : formData.specifications,
      };

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const savedProduct = await response.json();

      setProducts(prev => {
        if (editingProduct) {
          return prev.map(p => (p.products_id === savedProduct.products_id ? savedProduct : p));
        } else {
          return [savedProduct, ...prev];
        }
      });

      closeForm();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div> 
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FunnelIcon className="h-4 w-4 mr-1" />
            Filters
          </button>
          <button
            onClick={openAddForm}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Product
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Filter */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                name="search"
                id="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search products..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                id="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.categories_id} value={category.categories_id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <select
                name="brand"
                id="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand.brand_id} value={brand.brand_id}>
                    {brand.brand_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <XCircleIcon className="h-4 w-4 mr-1" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredProducts.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              {products.length === 0 ? 'No products found' : 'No products match your filters'}
            </li>
          ) : (
            filteredProducts.map(product => (
              <li key={product.products_id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {product.image_urls?.[0] && (
                      <img 
                        src={product.image_urls[0]} 
                        alt={product.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {product.brand_name} • {product.category_name} • ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price || '0.00'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openEditForm(product)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Product Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button 
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Product Name */}
                <div className="sm:col-span-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                    required
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                  />
                </div>

                {/* Price */}
                <div className="sm:col-span-2">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="block w-full pl-7 pr-12 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="sm:col-span-2">
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category_id"
                    id="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                    required
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map(category => (
                      <option key={category.categories_id} value={category.categories_id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div className="sm:col-span-2">
                  <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="brand_id"
                    id="brand_id"
                    value={formData.brand_id}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                    required
                  >
                    <option value="">-- Select Brand --</option>
                    {brands.map(brand => (
                      <option key={brand.brand_id} value={brand.brand_id}>
                        {brand.brand_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock Quantity */}
                <div className="sm:col-span-2">
                  <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    id="stock_quantity"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                    required
                  />
                </div>

                {/* Specifications */}
                <div className="sm:col-span-6">
                  <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-1">
                    Specifications (JSON)
                  </label>
                  <textarea
                    name="specifications"
                    id="specifications"
                    rows={4}
                    value={JSON.stringify(formData.specifications, null, 2)}
                    onChange={(e) => {
                      try {
                        const specs = e.target.value ? JSON.parse(e.target.value) : {};
                        setFormData(prev => ({ ...prev, specifications: specs }));
                      } catch (error) {
                        console.error('Invalid JSON:', error);
                      }
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border font-mono text-sm"
                    placeholder='{"key": "value"}'
                  />
                  <p className="mt-1 text-sm text-gray-500">Enter specifications as valid JSON (e.g., {"{\"color\": \"black\", \"size\": \"large\"}"})</p>
                </div>

                {/* Image Upload */}
                <div className="sm:col-span-6">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image
                  </label>
                  <div className="mt-1 flex items-center">
                    {formData.image_urls?.[0] ? (
                      <img
                        src={formData.image_urls[0]}
                        alt="Product preview"
                        className="h-24 w-24 object-cover rounded-md mr-4"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-24 w-24 bg-gray-100 rounded-md mr-4">
                        <PhotoIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <input
                      type="text"
                      name="image"
                      id="image"
                      value={formData.image_urls?.[0] || ''}
                      onChange={handleImageChange}
                      placeholder="Paste image URL here"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;