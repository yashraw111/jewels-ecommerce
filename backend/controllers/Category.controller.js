const CategoryModel = require("../models/Category.model");

exports.createCat = async (req, res) => {
  try {
    const { cat_name } = req.body;
    const category = await CategoryModel.create({
      cat_name,
      cat_image: req.file?.path,
    });
    res.json({ success: true, message: "Category created successfully" });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(categories);
  } catch (err) {
    console.error('Get Categories Error:', err);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const result = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { cat_name } = req.body;
    const updateData = { cat_name };

    if (req.file) {
      updateData.cat_image = req.file.path; // Cloudinary image
    }

    const updated = await CategoryModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updated,
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
