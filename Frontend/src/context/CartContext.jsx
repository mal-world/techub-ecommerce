import { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [showBubble, setShowBubble] = useState(false);

  // Convert price to number and clean currency formatting
  const cleanPrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      return parseFloat(price.replace(/[^0-9.-]/g, '')) || 0;
    }
    return 0;
  };

  // Memoized calculations
  const cartCount = useMemo(() => 
    cartProducts.reduce((sum, product) => sum + product.quantity, 0), 
    [cartProducts]
  );

  const cartTotal = useMemo(() => 
  cartProducts.reduce(
    (sum, product) => sum + cleanPrice(product.price) * product.quantity, 
    0
  ),
  [cartProducts]
);


  const addToCart = (product, quantity) => {
    setCartProducts(prevProducts => {
      const existingProduct = prevProducts.find(p => p.products_id === product.products_id);
      const cleanedProduct = {
        ...product,
        price: cleanPrice(product.price)
      };
      
      if (existingProduct) {
        return prevProducts.map(p =>
          p.products_id === product.products_id
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
      }
      return [...prevProducts, { 
        ...cleanedProduct, 
        quantity
      }];
    });
    
    setShowBubble(true);
    setTimeout(() => setShowBubble(false), 2000);
  };

  const removeFromCart = (products_id) => {
    setCartProducts(prev => prev.filter(p => p.products_id !== products_id));
  };

  const updateQuantity = (products_id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(products_id);
      return;
    }
    
    setCartProducts(prev =>
      prev.map(p =>
        p.products_id === products_id ? { ...p, quantity: newQuantity } : p
      )
    );
  };

  const clearCart = () => {
    setCartProducts([]);
  };

  const value = useMemo(() => ({
    cartProducts,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    showBubble
  }), [cartProducts, cartCount, cartTotal, showBubble]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}