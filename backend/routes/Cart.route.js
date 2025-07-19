const express = require("express");
const { toggleCart, getCartItems, deleteCartItem, clearCartByUserId } = require("../controllers/Cart.controller");
const router = express.Router();

// Routes
router.post("/toggle", toggleCart);
router.get("/:userId", getCartItems);
router.delete("/:id", deleteCartItem);
router.delete("/clear/:userId", clearCartByUserId); // ✅ New route

module.exports = router;
