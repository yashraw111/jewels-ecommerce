// ✅ Updated createOrder controller to clear cart after order placement
const Order = require("../models/Order.model");
const Cart = require("../models/Cart.model"); // ✅ Import the Cart model

const createOrder = async (req, res) => {
  try {
    const { userId, items, shippingInfo, totalPrice, paymentInfo } = req.body;

    const newOrder = new Order({
      user: userId,
      items,
      shippingInfo,
      totalPrice,
      paymentInfo,
      status: "Processing",
    });

    await newOrder.save();

    // ✅ Clear cart after order placement
    await Cart.deleteMany({ userId });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
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

// Update status (Admin only)
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

module.exports = {
  createOrder,
  updateOrderStatus,
  getAllOrders,
  getUserOrders,
};
