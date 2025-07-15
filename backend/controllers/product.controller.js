
// controllers/product.controller.js
const productModel = require("../models/product.model");

const addProduct = async (req, res) => {
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

    const images = req.files.map((file) => file.path);

    const newProduct = new productModel({
      category: CateGory,
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
      images,
    });

    const saved = await newProduct.save();
    res.status(201).json({ success: true, message: "Product created successfully", data: saved });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

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

    const images = req.files ? req.files.map((file) => file.path) : [];

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        category: CateGory,
        productName,
        material,
        sizes: Array.isArray(size) ? size : [size],
        WithoutDiscountPrice,
        productPrice,
        rate,
        description,
        alreadySold,
        quantity: available,
        discount,
        ...(images.length > 0 && { images }),
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Product updated", data: updatedProduct });
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

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Get Single Product Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getCatAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) filter.category = category;
    const products = await productModel.find(filter).populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const currentProduct = await productModel.findById(id);
    if (!currentProduct) return res.status(404).json({ message: "Product not found" });

    const related = await productModel.find({
      _id: { $ne: id },
      category: currentProduct.category,
    }).limit(4); // fetch max 4 related

    res.status(200).json({ success: true, products: related });
  } catch (err) {
    console.error("Related Product Error:", err);
    res.status(500).json({ error: err.message });
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

const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    product.reviews = product.reviews.filter((rev) => rev._id.toString() !== reviewId);
    await product.save();
    res.json({ success: true, message: "Review deleted successfully!" });
  } catch (err) {
    console.error("Delete review error:", err);
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
          ...review._doc,
        });
      });
    });
    res.json({ success: true, reviews: allReviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCusAllReviews = async (req, res) => {
  try {
    const { rating } = req.query; // e.g. /reviews/all?rating=5
    const filterRating = parseInt(rating) || 5; // default 5

    const products = await productModel.find().select("productName reviews");

    const allReviews = [];
    products.forEach((product) => {
      product.reviews
        .filter((review) => review.rating === filterRating)
        .forEach((review) => {
          allReviews.push({
            productId: product._id,
            productName: product.productName,
            ...review._doc,
          });
        });
    });

    res.json({ success: true, reviews: allReviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const getAllCategoriesWithProductCount = async (req, res) => {
  try {
    const categories = await Category.find();

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id });
        return {
          ...cat._doc,
          productCount: count,
        };
      })
    );

    res.status(200).json(categoriesWithCount);
  } catch (err) {
    console.error("Category fetch error", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  addProduct,
  deleteProduct,
  getAllCategoriesWithProductCount,
  updateProduct,
  getAllProducts,
  getProductById,
  getCatAllProducts,
  addReview,
  getCusAllReviews,
  deleteReview,
  getAllReviews,
  getRelatedProducts
};
