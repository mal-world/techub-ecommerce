import express from 'express'
import cartController from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.get('/:usr_id', cartController.getCart);

//add item to cart
cartRouter.post('/items', cartController.addToCart);

//update item quantity
cartRouter.put('/:cart_id/items/:product_id', cartController.updateCartItem);

//remove item from cart
cartRouter.delete('/:cart_id/items/:product_id', cartController.removeFromCart);

//clear cart
cartRouter.delete('/;cart_id', cartController.clearCart);

export default cartRouter;