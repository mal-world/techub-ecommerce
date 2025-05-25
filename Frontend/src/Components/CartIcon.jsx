// src/components/CartIcon.js
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export const CartIcon = () => {
  const { cartCount, showBubble } = useCart();
  
  return (
    <div className="relative">
      <ShoppingCartIcon className="h-6 w-6" />
      {cartCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ 
            scale: showBubble ? [1, 1.2, 1] : 1,
            transition: showBubble ? { duration: 0.5 } : {}
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
        >
          {cartCount}
        </motion.span>
      )}
    </div>
  );
};