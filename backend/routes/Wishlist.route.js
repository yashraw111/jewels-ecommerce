const router = require("express").Router();
const { toggleWishlist, getWishlist } = require("../controllers/Wishlist.controller");

router.post("/toggle", toggleWishlist);
router.get("/wishlist/:id", getWishlist);


module.exports = router;
