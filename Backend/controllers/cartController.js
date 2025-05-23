import cartModel from "../models/cartModel.js";

const cartController = {
    // Get user's cart with all items
    getCart: async (req, res) => {
        try {
            const { user_id } = req.params;
            const cart_id = await cartModel.findCartByUserId(user_id);
            if (!cart_id) {
                return res.json({
                    success: false,
                    message: "Cart not found for the user"
                });
            }
            
            const cartItems = await cartModel.findByUserId(user_id);
            const total = await cartModel.getCartTotal(cart_id);

            res.json({
                success: true,
                data: {
                    items: cartItems,
                    total: parseFloat(total)
                }
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Add to cart or update quantity if item exists
    addToCart: async (req, res) => {
        try {
            const { user_id, product_id, quantity } = req.body;

            if (!user_id || !product_id || !quantity || quantity <= 0) {
                return res.json({
                    success: false,
                    message: "Missing required fields or invalid quantity"
                });
            }

            // Get or create cart
            let cart_id = await cartModel.findCartByUserId(user_id);
            if (!cart_id) {
                const newCart = await cartModel.create(user_id);
                cart_id = newCart.cart_id;
            }

            // Add or update cart item
            const cartItem = await cartModel.addOrUpdateItem(cart_id, product_id, quantity);

            // Get updated cart and total
            const cartItems = await cartModel.findByUserId(user_id);
            const total = await cartModel.getCartTotal(cart_id);

            const product = await productModel.findById(product_id); // Assuming you have a model for products
            if (quantity > product.stock_quantity) {
                return res.json({
                    success: false,
                    message: `Insufficient stock. Only ${product.stock_quantity} items available.`
                });
            }
            
            res.json({
                success: true,
                data: {
                    item: cartItem,
                    items: cartItems,
                    total: parseFloat(total)
                }
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Update cart item quantity
    updateCartItem: async (req, res) => {
        try {
            const { cart_id, product_id } = req.params;
            const { quantity } = req.body;

            if (!quantity || quantity < 0) {
                return res.json({
                    success: false,
                    message: "Valid quantity is required"
                });
            }

            const updatedItem = await cartModel.updateItemQuantity(cart_id, product_id, quantity);

            if (!updatedItem) {
                return res.json({
                    success: false,
                    message: "Item not found in cart"
                });
            }

            // Get updated cart
            const cartItems = await cartModel.findByUserId(req.user.id);
            const total = await cartModel.getCartTotal(cart_id);

            const product = await productModel.findById(product_id);
            if (quantity > product.stock_quantity) {
                return res.json({
                    success: false,
                    message: `Insufficient stock. Only ${product.stock_quantity} items available.`
                });
            }


            res.json({
                success: true,
                data: {
                    item: updatedItem,
                    items: cartItems,
                    total: parseFloat(total)
                }
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Remove item from cart
    removeFromCart: async (req, res) => {
        try {
            const { cart_id, product_id } = req.params;

            const removedItem = await cartModel.removeItem(cart_id, product_id);

            if (!removedItem) {
                return res.json({
                    success: false,
                    message: "Item not found in the cart"
                });
            }

            // Get updated cart
            const cartItems = await cartModel.findByUserId(req.user.id);
            const total = await cartModel.getCartTotal(cart_id);

            res.json({
                success: true,
                data: {
                    removedItem,
                    items: cartItems,
                    total: parseFloat(total)
                }
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Clear cart
    clearCart: async (req, res) => {
        try {
            const { cart_id } = req.params;
            const clearedItems = await cartModel.clearCart(cart_id);

            res.json({
                success: true,
                message: "Cart cleared successfully",
                data: {
                    removedItem: clearedItems,
                    items: [],
                    total: 0
                }
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    }
};

export default cartController;