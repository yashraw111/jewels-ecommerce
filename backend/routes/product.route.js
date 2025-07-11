const express = require("express");
const router = express.Router();

const { addProduct, deleteProduct, updateProduct,getAllProducts, getProductById, getCatAllProducts, addReview, deleteReview, getAllReviews } = require("../controllers/product.controller");
const upload = require("../middleware/upload");

// ✅ Create Product
router.post("/", upload.array("images"), addProduct);
router.get("/", getAllProducts); // <-- added here
router.get("/cat", getCatAllProducts);// <-- added here
router.get("/:id", getProductById);
router.post("/:productId/review", addReview);
router.delete("/:productId/review/:userId", deleteReview);
// router.delete("/:productId/review/:userId", deleteReview); // ✅ Admin/user can delete review
router.get("/reviews/all", getAllReviews); // ✅ Admin can view all reviews




// ✅ Delete Product
router.delete("/:id", deleteProduct);

// ✅ Update Product
router.put("/:id", upload.array("images"), updateProduct);

module.exports = router;
