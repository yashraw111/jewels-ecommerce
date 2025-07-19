// controllers/order.controller.js

const Order = require("../models/Order.model");
const Cart = require("../models/Cart.model");
// Corrected import: Destructure decrementProductStock and productModel directly
const { decrementProductStock } = require("./product.controller"); 
const productModel = require("../models/product.model");

const createOrder = async (req, res) => {

  try {
    const { userId, items, shippingInfo, totalPrice, paymentInfo } = req.body;

    for (const item of items) {
      const product = await productModel.findById(item.productId); 
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found for item ID: ${item.productId}` });
      }
      const sizeToUpdate = product.sizes.find((s) => s.size === item.size);
      if (!sizeToUpdate || sizeToUpdate.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${item.productName || item.productId} (Size: ${item?.size}). Available: ${sizeToUpdate ? sizeToUpdate.quantity : 0}, Requested: ${item.quantity}`,
        });
      }
    }
    const newOrder = new Order({
      user: userId,
      items,
      shippingInfo,
      totalPrice,
      paymentInfo,
      status: "Processing",
    });

    const savedOrder = await newOrder.save();

    for (const item of items) {
      const { productId, size, quantity } = item;
      // Use decrementProductStock directly, assuming it's imported
      const result = await decrementProductStock(
        productId,
        size,
        quantity
      );

      if (!result.success) {
        console.error(
          `Failed to decrement stock for product ${productId} (size: ${size}, quantity: ${quantity}): ${result.message}. Order ID: ${savedOrder._id}`
        );
      }
    }

    await Cart.deleteMany({ user: userId });

    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("Create Order Error:", error);
    if (error.message.includes("stock") || error.message.includes("Product not found")) {
        res.status(400).json({ success: false, message: error.message });
    } else {
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId }).populate("items.productId");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("items.productId");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "Processing") {
      return res.status(400).json({ success: false, message: `Order cannot be cancelled in "${order.status}" status.` });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled successfully.", order });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to cancel order" });
  }
};

const requestReturn = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({ success: false, message: `Return cannot be requested for order in "${order.status}" status.` });
    }

    order.status = "Return Requested";
    await order.save();

    res.status(200).json({ success: true, message: "Return requested successfully.", order });
  } catch (error) {
    console.error("Request Return Error:", error);
    res.status(500).json({ success: false, message: "Failed to request return" });
  }
};

module.exports = {
  createOrder,
  updateOrderStatus,
  getAllOrders,
  getUserOrders,
  cancelOrder,
  requestReturn,
};