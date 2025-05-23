import express from 'express';
import orderController from '../controllers/orderController.js';

const orderRouter = express.Router();

// create
orderRouter.post('/', orderController.createOrder);

// get order details
orderRouter.get('/:order_id', orderController.getOrderDetails);

// get payment status
orderRouter.patch('/payment/:payment_id', orderController.updatePaymentStatus);

// update shipping
orderRouter.patch('/:order_id/shipping', orderController.updateShippingTracking);

export default orderRouter;