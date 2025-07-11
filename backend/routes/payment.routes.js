const express = require("express");
const { createRazorpayOrder } = require("../controllers/order.controller");
const router = express.Router();

router.post("/create-order", createRazorpayOrder);

module.exports = router;
