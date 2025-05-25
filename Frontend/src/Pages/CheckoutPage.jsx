import { useState } from 'react';
import { FaArrowLeft, FaMapMarkerAlt, FaUser, FaPhone, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { RiVisaFill } from 'react-icons/ri';
import { SiStripe, SiRazorpay } from 'react-icons/si';

const CheckoutPage = () => {
  const [step, setStep] = useState(1); // 1 = Delivery Info, 2 = Payment
  const [paymentMethod, setPaymentMethod] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    user_id: '', // This would typically come from auth context
    first_name: '',
    last_name: '',
    address1: '',
    address2: '',
    city: '',
    post_code: '',
    state: '',
    phone_number: '',
    save_info: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitDelivery = (e) => {
    e.preventDefault();
    setStep(2); // Move to payment step
  };

  const handlePlaceOrder = () => {
    // Here you would handle the payment processing
    // with Stripe or Razorpay based on selection
    console.log('Placing order with:', {
      ...formData,
      payment_method: paymentMethod
    });
    // Redirect to order confirmation page
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Checkout Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => step === 1 ? window.history.back() : setStep(1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
              <span className="font-medium">1</span>
            </div>
            <span className="mt-2 text-sm">Delivery</span>
          </div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
              <span className="font-medium">2</span>
            </div>
            <span className="mt-2 text-sm">Payment</span>
          </div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
              <span className="font-medium">3</span>
            </div>
            <span className="mt-2 text-sm">Complete</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {step === 1 ? (
              /* Delivery Information Form */
              <form onSubmit={handleSubmitDelivery} className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <FaMapMarkerAlt className="text-blue-500 mr-2" />
                  Delivery Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address1"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="House number and street name"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    id="address2"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="post_code" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP/Postal Code *
                    </label>
                    <input
                      type="text"
                      id="post_code"
                      name="post_code"
                      value={formData.post_code}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="phone_number" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaPhone className="mr-2 text-gray-500" />
                        Phone Number *
                    </label>

                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="save_info"
                    name="save_info"
                    checked={formData.save_info}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="save_info" className="ml-2 block text-sm text-gray-700">
                    Save this information for next time
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
                >
                  Continue to Payment
                </button>
              </form>
            ) : (
              /* Payment Method Selection */
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <FaCreditCard className="text-blue-500 mr-2" />
                  Payment Method
                </h2>

                <div className="space-y-4 mb-6">
                  <div 
                    onClick={() => setPaymentMethod('stripe')}
                    className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'stripe' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}
                  >
                    <div className="flex items-center">
                      <SiStripe className="text-2xl text-blue-600 mr-3" />
                      <div>
                        <h3 className="font-medium">Credit/Debit Card (Stripe)</h3>
                        <p className="text-sm text-gray-500">Pay with Visa, Mastercard, etc.</p>
                      </div>
                      {paymentMethod === 'stripe' && (
                        <div className="ml-auto flex space-x-2">
                          <RiVisaFill className="text-2xl text-gray-700" />
                          <FaCreditCard className="text-xl text-gray-700" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'razorpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}
                  >
                    <div className="flex items-center">
                      <SiRazorpay className="text-2xl text-blue-800 mr-3" />
                      <div>
                        <h3 className="font-medium">Razorpay</h3>
                        <p className="text-sm text-gray-500">Pay with UPI, Netbanking, Wallets</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}
                  >
                    <div className="flex items-center">
                      <FaMoneyBillWave className="text-2xl text-green-600 mr-3" />
                      <div>
                        <h3 className="font-medium">Cash on Delivery</h3>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={!paymentMethod}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${paymentMethod ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Place Order
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>$499.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>$40.00</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-medium text-gray-900">
                  <span>Total</span>
                  <span>$539.99</span>
                </div>
              </div>

              {step === 1 && (
                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                  <p>You'll have a chance to review your order before placing it.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;