import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserAstronaut, FaFingerprint, FaEye, FaEyeSlash, FaGoogle, FaApple, FaFacebook, FaRobot, FaTimes } from 'react-icons/fa';
import { RiLockPasswordLine, RiVerifiedBadgeFill } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const LogInPage = () => {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    if (redirectTo) {
      const timer = setTimeout(() => {
        navigate(redirectTo);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [redirectTo, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showSignUp) {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      if (name === 'email') setEmail(value);
      if (name === 'password') setPassword(value);
      if (name === 'remember-me') setRememberMe(!rememberMe);
    }
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  
  try {
    const response = await axios.post('http://localhost:4000/api/user/login', {
      email,
      password
    });
    
    localStorage.setItem('authToken', response.data.token);
    
    // Fetch full profile immediately after login
    const profileResponse = await axios.get('http://localhost:4000/api/user/profile', {
      headers: {
        Authorization: `Bearer ${response.data.token}`
      }
    });

    // Store user data in state/context/Redux as needed
    setUserData(profileResponse.data.user);
    
    setSuccessMessage(`Welcome back, ${profileResponse.data.user.first_name}!`);
    setRedirectTo('/dashboard');
  } catch (error) {
    // Error handling
  } finally {
    setIsLoading(false);
  }
};

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (currentStep < 3) {
        if (currentStep === 1) {
          if (!formData.firstName || !formData.lastName || !formData.email) {
            throw new Error('Please fill in all fields');
          }
          if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            throw new Error('Please enter a valid email');
          }
        }
        if (currentStep === 2) {
          if (formData.password !== formData.confirmPassword) {
            throw new Error('Passwords do not match');
          }
          if (!isPasswordStrong(formData.password)) {
            throw new Error('Password must contain: 8+ chars, uppercase, lowercase, number, and special char');
          }
        }
        
        setCurrentStep(currentStep + 1);
        setIsLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:4000/api/user/register', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      console.log('Registration successful:', response.data);
      localStorage.setItem('authToken', response.data.token);
      setSuccessMessage(`Welcome to TECHUB, ${formData.firstName}!`);
      setVerificationSent(true);
      setRedirectTo('/');
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.error || error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordStrong = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_\-]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough;
  };

  const handleSubmit = (e) => {
    if (showSignUp) {
      handleRegister(e);
    } else {
      handleLogin(e);
    }
  };

  const toggleAuthMode = () => {
    setShowSignUp(!showSignUp);
    setCurrentStep(1);
    setVerificationSent(false);
    setError('');
  };

  const steps = [
    { id: 1, name: 'Account Details', icon: <FaUserAstronaut /> },
    { id: 2, name: 'Security Setup', icon: <RiLockPasswordLine /> },
    { id: 3, name: 'Verification', icon: <RiVerifiedBadgeFill /> }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 overflow-hidden">
      {/* Success message overlay */}
      {successMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-xl p-8 max-w-md mx-4 text-center border border-purple-500"
          >
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-900 bg-opacity-30 mb-4">
              <RiVerifiedBadgeFill className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
              Success!
            </h3>
            <p className="mb-6 text-lg">{successMessage}</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
            <p className="mt-4 text-sm text-gray-400">Redirecting you now...</p>
          </motion.div>
        </div>
      )}

      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Close button for sign-up */}
        {showSignUp && (
          <button 
            onClick={toggleAuthMode}
            className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        )}

        <AnimatePresence mode="wait">
          {!showSignUp ? (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-700 shadow-2xl"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div className="p-8">
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-blue-600 rounded-full blur opacity-75"></div>
                    <div className="relative bg-gray-900 p-4 rounded-full border border-blue-400">
                      <FaUserAstronaut className="text-3xl text-blue-400" />
                    </div>
                  </div>
                  <h1 className="mt-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    TECHUB ACCESS
                  </h1>
                  <p className="text-gray-400 mt-2">Enter your credentials to continue</p>
                </div>

                {error && (
                  <div className="p-3 mb-4 text-sm text-red-400 bg-red-900 bg-opacity-50 rounded-lg">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaFingerprint className="text-blue-400 group-hover:text-purple-400 transition-colors" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-white transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <RiLockPasswordLine className="text-blue-400 group-hover:text-purple-400 transition-colors" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-white transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="text-gray-400 hover:text-blue-400" />
                        ) : (
                          <FaEye className="text-gray-400 hover:text-blue-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isLoading ? 'opacity-80' : ''}`}
                    >
                      {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        'Sign in'
                      )}
                    </motion.button>
                  </div>
                </form>

                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                      <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg shadow-sm bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 transition-colors">
                        <FaGoogle className="text-red-400" />
                      </a>
                    </motion.div>
                    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                      <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg shadow-sm bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 transition-colors">
                        <FaApple className="text-gray-300" />
                      </a>
                    </motion.div>
                    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                      <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg shadow-sm bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 transition-colors">
                        <FaFacebook className="text-blue-400" />
                      </a>
                    </motion.div>
                  </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-400">
                  Don't have an account?{' '}
                  <button onClick={toggleAuthMode} className="font-medium text-blue-400 hover:text-blue-300">
                    Create Account
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-700 shadow-2xl"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div className="p-8">
                <div className="flex flex-col items-center mb-8">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 1 }}
                    className="relative mb-4"
                  >
                    <div className="absolute -inset-4 bg-blue-600 rounded-full blur opacity-75"></div>
                    <div className="relative bg-gray-900 p-4 rounded-full border border-blue-400">
                      <FaRobot className="text-3xl text-blue-400" />
                    </div>
                  </motion.div>
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    TECHUB REGISTRATION
                  </h1>
                  <p className="text-gray-400 mt-2">Join the future of tech shopping</p>
                </div>

                {error && (
                  <div className="p-3 mb-4 text-sm text-red-400 bg-red-900 bg-opacity-50 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="mb-8">
                  <nav aria-label="Progress">
                    <ol className="flex items-center">
                      {steps.map((step, index) => (
                        <li key={step.id} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                          {step.id < currentStep ? (
                            <>
                              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-blue-600"></div>
                              </div>
                              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                                {step.icon}
                                <span className="sr-only">{step.name}</span>
                              </div>
                            </>
                          ) : step.id === currentStep ? (
                            <>
                              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-gray-600"></div>
                              </div>
                              <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-600 bg-gray-900">
                                <span className="text-blue-400">{step.icon}</span>
                                <span className="sr-only">{step.name}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-gray-600"></div>
                              </div>
                              <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-600 bg-gray-900 hover:border-gray-400">
                                <span className="text-gray-400 group-hover:text-gray-300">
                                  {step.icon}
                                </span>
                                <span className="sr-only">{step.name}</span>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ol>
                  </nav>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="group">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                          First Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUserAstronaut className="text-blue-400 group-hover:text-purple-400 transition-colors" />
                          </div>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-white transition-all"
                            placeholder="Khoirul"
                          />
                        </div>
                      </div>
                      <div className="group">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                          Last Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUserAstronaut className="text-blue-400 group-hover:text-purple-400 transition-colors" />
                          </div>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-white transition-all"
                            placeholder="Ikhmal"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaFingerprint className="text-blue-400 group-hover:text-purple-400 transition-colors" />
                          </div>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-white transition-all"
                            placeholder="mal@techub.com"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="group">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                          Create Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiLockPasswordLine className="text-blue-400 group-hover:text-purple-400 transition-colors" />
                          </div>
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-white transition-all"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <FaEyeSlash className="text-gray-400 hover:text-blue-400" />
                            ) : (
                              <FaEye className="text-gray-400 hover:text-blue-400" />
                            )}
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-400">Minimum 8 characters with uppercase, lowercase, number, and special character</p>
                      </div>

                      <div className="group">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiLockPasswordLine className="text-blue-400 group-hover:text-purple-400 transition-colors" />
                          </div>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-white transition-all"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && !verificationSent && (
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                      className={`w-full inline-flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isLoading ? 'opacity-80' : ''}`}
                    >
                      {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : 'Complete Registration'}
                    </motion.button>
                  )}

                  <div className="flex justify-between">
                    {currentStep > 1 && currentStep < 3 && (
                      <motion.button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        whileHover={{ x: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                      >
                        Back
                      </motion.button>
                    )}

                    {currentStep < 3 && !verificationSent ? (
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        className={`ml-auto inline-flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isLoading ? 'opacity-80' : ''}`}
                      >
                        {isLoading ? (
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : null}
                        {currentStep === 1 ? 'Continue to Security' : 'Complete Registration'}
                      </motion.button>
                    ) : null}
                  </div>
                </form>

                {currentStep === 1 && (
                  <div className="mt-8 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <button onClick={toggleAuthMode} className="font-medium text-blue-400 hover:text-blue-300">
                      Sign in
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute -z-10">
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-500 opacity-10 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-purple-500 opacity-10 blur-xl"
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LogInPage;