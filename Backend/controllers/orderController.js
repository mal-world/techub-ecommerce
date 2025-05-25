import OrderItemModel from "../models/orderItemModel.js";
import orderModel from "../models/orderModel.js";
import paymentModel from "../models/paymentModel.js";
import cartModel from "../models/cartModel.js";
import productModel from '../models/productModel.js';

const orderController = {
  createOrder: async (req, res) => {
    try {
      const { user_id, items, payment_method } = req.body;
      
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
      res.status(201).json({
        success: true,
        data: { order, payment }
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

      res.status(200).json({
        success: true,
        data: { ...order, items, payment }
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

  checkoutCart: async (req, res) => {
    try {
      const { user_id, payment_method } = req.body;

      const cart_id = await cartModel.findCartByUserId(user_id);
      const cartItems = await cartModel.findByUserId(user_id);

      if (!cartItems || cartItems.length === 0) {
        return res.json({
          success: false,
          message: "Cart is empty"
        });
      }

      // Calculate total amount
      const total_amount = cartItems.reduce(
        (sum, item) => sum + item.quantity * parseFloat(item.price),
        0
      );

      // Create order
      const order = await orderModel.create(user_id, total_amount);

      // Copy items to orderitems
      await Promise.all(cartItems.map(item =>
        OrderItemModel.create(
          order.order_id,
          item.product_id,
          item.quantity,
          item.price
        )
      ));

      // Create payment
      const payment = await paymentModel.create(
        order.order_id,
        payment_method,
        total_amount
      );

      // (Optional) Decrease stock
      await Promise.all(cartItems.map(async item => {
        const product = await productModel.findById(item.product_id);
        const newStock = product.stock_quantity - item.quantity;
        await productModel.updateStock(item.product_id, newStock);
      }));

      // Clear cart
      await cartModel.clearCart(cart_id);

      res.json({
        success: true,
        message: "Checkout successful",
        data: { order, payment }
      });

    } catch (error) {
      res.json({
        success: false,
        message: error.message
      });
    }
  },

  //admin get all order
  getAllOrders: async (req, res) => {
    try {
      const orders = await orderModel.getAll();
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      res.json({
        success: false,
        message: error.message
      });
    }
  },

  //admin
  getOrdersByUser: async (req, res) => {
  try {
    const { user_id } = req.params;
    const orders = await orderModel.findByUserId(user_id);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


};

export default orderController;