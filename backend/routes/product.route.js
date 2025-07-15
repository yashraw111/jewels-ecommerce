const express = require("express");
const router = express.Router();

const {
  addProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  getCatAllProducts,
  addReview,
  deleteReview,
  getAllReviews,
  getRelatedProducts,
  getCusAllReviews,
  getAllCategoriesWithProductCount
} = require("../controllers/product.controller");

const upload = require("../middleware/upload");

router.post("/", upload.array("images"), addProduct);
router.get("/", getAllProducts);
router.get("/cat", getCatAllProducts);
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts); // ✅ Related products route
router.post("/:productId/review", addReview);
router.delete("/:productId/review/:reviewId", deleteReview);
router.get("/reviews/all", getAllReviews);
router.delete("/:id", deleteProduct);
router.put("/:id", upload.array("images"), updateProduct);
router.get("/reviews/customer", getCusAllReviews); 
router.get("/categories/with-count", getAllCategoriesWithProductCount);



module.exports = router;

