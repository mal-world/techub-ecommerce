import { FaTrash, FaShoppingCart, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const CartPage = () => {
  const {
    cartProducts,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCart();

  const formatPrice = (price) => {
    const num = typeof price === 'string' ? 
      parseFloat(price.replace(/[^0-9.-]/g, '')) : 
      price;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const handleRemoveProduct = (products_id) => {
    removeFromCart(products_id);
    toast.error('Product removed from cart');
  };

  const handleUpdateQuantity = (products_id, newQuantity) => {
    updateQuantity(products_id, newQuantity);
    if (newQuantity < 1) {
      toast.error('Product removed from cart');
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast.info('Cart cleared');
  };

  // Calculate order summary values
  const subtotal = cartTotal;
  const shipping = 0; // Free shipping
  const tax = cartTotal * 0.08; // Example 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaShoppingCart className="mr-2 text-blue-600" />
            Your Cart ({cartProducts.reduce((sum, product) => sum + product.quantity, 0)})
          </h1>
          {cartProducts.length > 0 && (
            <button 
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-700 text-sm flex items-center"
            >
              <FaTrash className="mr-1" /> Clear Cart
            </button>
          )}
        </div>

        {/* Cart Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Products List */}
          <div className="lg:w-2/3">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-white p-4 rounded-lg shadow mb-4">
              <div className="col-span-5 font-medium text-gray-700">Product</div>
              <div className="col-span-2 font-medium text-gray-700 text-center">Price</div>
              <div className="col-span-3 font-medium text-gray-700 text-center">Quantity</div>
              <div className="col-span-2 font-medium text-gray-700 text-right">Total</div>
            </div>

            {/* Products List */}
            <div className="space-y-4">
              {cartProducts.length > 0 ? (
                cartProducts.map((product) => (
                  <div key={product.products_id} className="bg-white p-4 rounded-lg shadow flex flex-col md:grid md:grid-cols-12 gap-4">
                    {/* Product Info */}
                    <div className="flex items-center space-x-4 md:col-span-5">
                      <img 
                        src={product.image_urls?.[0] || 'https://via.placeholder.com/80?text=No+Image'} 
                        alt={product.name} 
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <button 
                          onClick={() => handleRemoveProduct(product.products_id)}
                          className="text-red-500 hover:text-red-700 flex items-center mt-1 text-sm"
                        >
                          <FaTrash className="mr-1" /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center md:justify-center md:col-span-2">
                      <span className="text-gray-700">${formatPrice(product.price)}</span>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center md:justify-center md:col-span-3">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button 
                          onClick={() => handleUpdateQuantity(product.products_id, product.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-center w-12">{product.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(product.products_id, product.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-end md:col-span-2">
                      <span className="font-medium">
                        ${formatPrice(product.price * product.quantity)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                  <FaShoppingCart className="mx-auto text-4xl text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500">Looks like you haven't added any products to your cart yet</p>
                  <Link
                    to="/laptop"
                    className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          {cartProducts.length > 0 && (
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow sticky top-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-medium text-gray-900">
                    <span>Total</span>
                    <span>${formatPrice(total)}</span>
                  </div>
                </div>
                
                <Link 
                  to="/checkout"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md flex items-center justify-center font-medium transition-colors"
                >
                  <FaCreditCard className="mr-2" />
                  Proceed to Checkout
                </Link>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  By placing your order, you agree to TECHUB's privacy notice and conditions of use.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;