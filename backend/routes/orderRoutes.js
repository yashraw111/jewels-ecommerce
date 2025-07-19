const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
  requestReturn,
} = require("../controllers/order.controller");

router.post("/", createOrder);
router.get("/", getAllOrders); // for admin

router.get("/user/:userId", getUserOrders); // optional: to get user's orders
router.put("/status/:orderId", updateOrderStatus);
router.post("/cancel/:orderId", cancelOrder);     // <--- New route for cancelling
router.post("/return/:orderId", requestReturn); // <--- New route for returning


module.exports = router;
