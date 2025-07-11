const productModel = require("../models/product.model");

const addProduct = async (req, res, next) => {
  try {
    const {
      CateGory,
      productName,
      material,
      size,
      WithoutDiscountPrice,
      productPrice,
      rate,
      description,
      alreadySold,
      available,
      discount,
    } = req.body;

    // ✅ images ka array banao cloudinary path se
    const images = req.files.map((file) => file.path);

    const newProduct = new productModel({
      category: CateGory, // assuming CateGory == category ID
      productName,
      material,
      size,
      WithoutDiscountPrice,
      productPrice,
      rate,
      description,
      alreadySold,
      available,
      discount,
      images, // ✅ array of image URLs
    });

    const saved = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ✅ DELETE product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ UPDATE product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      CateGory,
      productName,
      material,
      size,
      WithoutDiscountPrice,
      productPrice,
      rate,
      description,
      alreadySold,
      available,
      discount,
    } = req.body;

    // ✅ Cloudinary image paths
    const images = req.files ? req.files.map((file) => file.path) : [];

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        category: CateGory,
        productName,
        material,
        sizes: Array.isArray(size) ? size : [size], // ensure it's an array
        WithoutDiscountPrice,
        productPrice,
        rate,
        description,
        alreadySold,
        quantity: available,
        discount,
        ...(images.length > 0 && { images }), // only update images if provided
      },
      { new: true }
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Product updated",
        data: updatedProduct,
      });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product by ID
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get Single Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getCatAllProducts = async (req, res) => {
      // console.log("Query:", req.query); // <-- yeh dekho kya aa raha

  try {
    const { category } = req.query;
    let filter = {};
    if (category) {
      filter.category = category;
    }

    const products = await productModel.find(filter).populate("category");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment, name, userId } = req.body;

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.reviews.push({ rating, comment, name, userId });
    await product.save();

    res.json({ success: true, message: "Review added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// DELETE Review by user
const deleteReview = async (req, res) => {
  try {
    const { productId, userId } = req.params;

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Filter reviews - remove only review by userId
    const updatedReviews = product.reviews.filter(
      (rev) => rev.userId.toString() !== userId
    );

    product.reviews = updatedReviews;
    await product.save();

    res.json({ success: true, message: "Review deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAllReviews = async (req, res) => {
  try {
    const products = await productModel.find().select("productName reviews");
    const allReviews = [];

    products.forEach((product) => {
      product.reviews.forEach((review) => {
        allReviews.push({
          productId: product._id,
          productName: product.productName,
          ...review._doc, // userId, comment, rating, name, _id
        });
      });
    });

    res.json({ success: true, reviews: allReviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  addProduct,
  addReview,
  deleteProduct,
  deleteReview,
  getProductById,
  getCatAllProducts,
  getAllProducts,
  getAllReviews,
  updateProduct,
};
