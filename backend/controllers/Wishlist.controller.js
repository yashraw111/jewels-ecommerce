const User = require("../models/Auth.model");

const toggleWishlist = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isLiked = user.wishlist.includes(productId);

    if (isLiked) {
      user.wishlist.pull(productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isLiked ? "Removed from wishlist" : "Added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (err) {
    console.error("Toggle Wishlist Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("wishlist");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch wishlist" });
  }
};

module.exports = { toggleWishlist,getWishlist };
