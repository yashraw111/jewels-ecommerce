const express = require("express");
const { toggleCart, getCartItems, deleteCartItem } = require("../controllers/Cart.controller");
const router = express.Router();

// Routes
router.post("/toggle", toggleCart);
router.get("/:userId", getCartItems);
router.delete("/:id", deleteCartItem);
module.exports = router;
