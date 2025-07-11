const router = require("express").Router();
const upload = require("../middleware/upload");
const {
  createBanner,
  getAllBanners,
  deleteBanner,
  updateBanner,
} = require("../controllers/Banner.controller");

router.post("/", upload.single("banner_image"), createBanner);
router.get("/", getAllBanners);
router.delete("/:id", deleteBanner);
router.put("/:id", upload.single("banner_image"), updateBanner);

module.exports = router;
