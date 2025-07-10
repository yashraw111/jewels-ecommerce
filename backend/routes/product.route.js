const express = require("express");
const router = express.Router();

const { addProduct, deleteProduct, updateProduct,getAllProducts, getProductById } = require("../controllers/product.controller");
const upload = require("../middleware/upload");

// ✅ Create Product
router.post("/", upload.array("images"), addProduct);
router.get("/", getAllProducts); // <-- added here
router.get("/:id", getProductById);

// ✅ Delete Product
router.delete("/:id", deleteProduct);

// ✅ Update Product
router.put("/:id", upload.array("images"), updateProduct);

module.exports = router;
