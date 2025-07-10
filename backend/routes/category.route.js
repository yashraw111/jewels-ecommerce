const router = require("express").Router();
const {
  createCat,
  getAllCategories,
  deleteCategory,
  updateCategory,
} = require("../controllers/Category.controller");
const upload = require("../middleware/upload");

// Create
router.post("/", upload.single("cat_image"), createCat);

// Read
router.get("/", getAllCategories);

// Delete ✅
router.delete("/:id", deleteCategory);

// Update ✅
router.put("/:id", upload.single("cat_image"), updateCategory);

module.exports = router;
