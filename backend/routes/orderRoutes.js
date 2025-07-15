const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/order.controller");

router.post("/", createOrder);
router.get("/", getAllOrders); // for admin

router.get("/user/:userId", getUserOrders); // optional: to get user's orders
router.put("/status/:orderId", updateOrderStatus);

module.exports = router;
