import express from 'express';
import orderController from '../controllers/orderController.js';

const orderRouter = express.Router();

// create
orderRouter.post('/', orderController.createOrder);

// get order details
orderRouter.get('/:order_id', orderController.getOrderDetails);

// get payment status
orderRouter.patch('/payment/:payment_id', orderController.updatePaymentStatus);

//chechout
orderRouter.post('/checkout', orderController.checkoutCart);

//admin get all the order
orderRouter.get('/', orderController.getAllOrders);

orderRouter.get('/user/:user_id', orderController.getOrdersByUser);

export default orderRouter;