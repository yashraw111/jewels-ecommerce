const Cart = require("../models/Cart.model");

// ✅ Toggle Add/Remove from Cart
exports.toggleCart = async (req, res) => {
  try {
    const { userId, productId, size, material, quantity } = req.body;

    const existing = await Cart.findOne({ userId, productId, size, material });

    if (existing) {
      await Cart.findByIdAndDelete(existing._id);
      return res.json({ message: "Removed from cart" });
    }

    const newCart = new Cart({
      userId,
      productId,
      size,
      material,
      quantity: quantity || 1,
    });

    await newCart.save();
    res.json({ message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Get all Cart Items for a User
exports.getCartItems = async (req, res) => {
  try {
    const userId = req.params.userId;
    const items = await Cart.find({ userId }).populate("productId");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete specific cart item
exports.deleteCartItem = async (req, res) => {
  // clg
  try {
    const { id } = req.params; // Cart item _id
    await Cart.findByIdAndDelete(id);
    res.json({ message: "Cart item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.clearCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.deleteMany({ userId });
    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

