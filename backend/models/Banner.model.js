const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    banner_image: { type: String, required: true }, // Cloudinary path
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", BannerSchema);
