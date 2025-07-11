const BannerModel = require("../models/Banner.model");

exports.createBanner = async (req, res) => {
  try {
    const { title } = req.body;
    const banner = await BannerModel.create({
      title,
      banner_image: req.file?.path,
    });
    res.status(201).json({ success: true, message: "Banner created", banner });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await BannerModel.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Error fetching banners" });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const deleted = await BannerModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, message: "Banner deleted" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { title } = req.body;
    const updatedData = { title };
    if (req.file) updatedData.banner_image = req.file.path;

    const updated = await BannerModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Banner not found" });

    res.json({ success: true, message: "Banner updated", banner: updated });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
