import OrderItemModel from "../models/orderItemModel.js";
import orderModel from "../models/orderModel.js";
import paymentModel from "../models/paymentModel.js";
import shippingModel from "../models/shippingModel.js";

const orderController = {
  createOrder: async (req, res) => {
    try {
      const { user_id, items, payment_method, shipping_info } = req.body;
      
      // Calculate total amount
      const total_amount = items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      // Create order
      const order = await orderModel.create(user_id, total_amount);

      // Add order items
      await Promise.all(
        items.map(item => 
          OrderItemModel.create(
            order.order_id, 
            item.product_id, 
            item.quantity, 
            item.price
          )
        )
      );

      // Create payment record
      const payment = await paymentModel.create(
        order.order_id,
        payment_method,
        total_amount
      );

      // Create shipping record
      const shipping = await shippingModel.create(
        order.order_id,
        shipping_info.method,
        shipping_info.carrier,
        shipping_info.cost,
        shipping_info.estimated_date
      );

      res.status(201).json({
        success: true,
        data: { order, payment, shipping }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getOrderDetails: async (req, res) => {
    try {
      const { order_id } = req.params;
      
      const order = await orderModel.findById(order_id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      const items = await OrderItemModel.findByOrderId(order_id);
      const payment = await paymentModel.findByOrderId(order_id);
      const shipping = await shippingModel.findByOrderId(order_id);

      res.status(200).json({
        success: true,
        data: { ...order, items, payment, shipping }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  updatePaymentStatus: async (req, res) => {
    try {
      const { payment_id } = req.params;
      const { status } = req.body;

      const payment = await paymentModel.updateStatus(payment_id, status);
      
      // Update order status if payment is completed
      if (status === 'paid') {
        await orderModel.updateStatus(payment.order_id, 'processing');
      }

      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  updateShippingTracking: async (req, res) => {
    try {
      const { order_id } = req.params;
      const { carrier, tracking_number } = req.body;

      const shipping = await shippingModel.updateTracking(
        order_id,
        carrier,
        tracking_number
      );

      res.status(200).json({
        success: true,
        data: shipping
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

export default orderController;