import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon, ShoppingCartIcon, HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('description');

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/products/${productId}`);
        setProduct(response.data);
        
        // Fetch related products from the same brand
        if (response.data.brand_id) {
          const relatedResponse = await axios.get(
            `http://localhost:4000/api/products?category_id=${response.data.category_id}&brand_id=${response.data.brand_id}&limit=4`
          );
          if (Array.isArray(relatedResponse.data)) {
            setRelatedProducts(relatedResponse.data.filter(p => p.products_id !== parseInt(productId)));
          } else {
            setRelatedProducts([]);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Handle quantity changes
  const handleQuantityChange = (value) => {
    const newValue = Math.max(1, Math.min(99, quantity + value));
    setQuantity(newValue);
  };

  // Add to cart with toast notification
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    toast.success(`${quantity} × ${product.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Toggle wishlist status
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.info(
      isWishlisted 
        ? `Removed ${product.name} from wishlist` 
        : `Added ${product.name} to wishlist`,
      {
        position: "bottom-right",
        autoClose: 2000,
      }
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-gray-600">Product not found.</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Home
            </button>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <button 
                onClick={() => navigate(`/${product.category_name?.toLowerCase() || 'laptop'}`)}
                className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 capitalize"
              >
                {product.category_name || 'Laptop'}
              </button>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 line-clamp-1">
                {product.name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Main Product Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
              {product.image_urls?.[selectedImage] ? (
                <img
                  src={product.image_urls[selectedImage]}
                  alt={product.name}
                  className="h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600?text=No+Image';
                  }}
                />
              ) : (
                <img
                  src="https://via.placeholder.com/600?text=No+Image"
                  alt="No product image"
                  className="h-full object-contain"
                />
              )}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {product.image_urls?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.image_urls.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-24 bg-gray-50 rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            </div>

            {/* Brand and Rating */}
            <div className="flex items-center mb-4">
              <span className="text-sm text-gray-600 mr-4">Brand: {product.brand_name || 'Unknown'}</span>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={`h-5 w-5 ${rating <= (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill={rating <= (product.rating || 0) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-600">({product.review_count || 0})</span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-blue-600">
                ${Number(product.price || 0).toFixed(2)}
              </p>
              {product.original_price && product.original_price > product.price && (
                <p className="text-sm text-gray-500 line-through">
                  ${Number(product.original_price).toFixed(2)}
                </p>
              )}
            </div>

            {/* Key Specifications Preview */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Key Specifications</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {product.specifications?.processor && (
                  <div>
                    <span className="text-gray-600">Processor:</span>{' '}
                    <span className="font-medium">{product.specifications.processor}</span>
                  </div>
                )}
                {product.specifications?.ram && (
                  <div>
                    <span className="text-gray-600">RAM:</span>{' '}
                    <span className="font-medium">{product.specifications.ram}</span>
                  </div>
                )}
                {product.specifications?.storage && (
                  <div>
                    <span className="text-gray-600">Storage:</span>{' '}
                    <span className="font-medium">{product.specifications.storage}</span>
                  </div>
                )}
                {product.specifications?.screen_size && (
                  <div>
                    <span className="text-gray-600">Screen Size:</span>{' '}
                    <span className="font-medium">{product.specifications.screen_size}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <span className="mr-4 text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-center w-12">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100"
                    disabled={quantity >= 99}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors duration-200"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
            </div>

            {/* Delivery Info */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center mb-2">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-600">In stock and ready to ship</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-600">Estimated delivery: 2-3 business days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'description'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'specifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Specifications
            </button>
          </nav>
        </div>
        <div className="p-6 text-gray-700">
          {activeTab === 'description' && (
            <p>{product.description || 'No detailed description available for this product.'}</p>
          )}
          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key}>
                  <span className="text-gray-600">{key}:</span>{' '}
                  <span className="font-medium">
                    {typeof value === 'object'
                      ? Array.isArray(value)
                        ? value.join(', ')
                        : Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ')
                      : value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.products_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-4">
                  <div className="h-48 flex items-center justify-center bg-gray-100 mb-4">
                    {relatedProduct.image_urls?.[0] ? (
                      <img
                        src={relatedProduct.image_urls[0]}
                        alt={relatedProduct.name}
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
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">{relatedProduct.name}</h3>
                  <p className="text-blue-600 font-bold text-xl mb-2">
                    ${Number(relatedProduct.price || 0).toFixed(2)}
                  </p>
                  <button
                    onClick={() => navigate(`/products/${relatedProduct.products_id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;