// controllers/product.controller.js
const productModel = require("../models/product.model");
const Category = require("../models/Category.model"); // Assuming your Category model is here

const addProduct = async (req, res) => {
  try {
    const {
      CateGory,
      productName,
      material,
      // Removed 'size' from direct destructuring as it's part of 'sizes' array now
      WithoutDiscountPrice,
      productPrice,
      rate,
      description,
      alreadySold,
      // Removed 'available' as it's part of 'sizes' quantity
      discount,
      sizes, // Expecting sizes as an array of { size, quantity }
    } = req.body;

    const images = req.files ? req.files.map((file) => file.path) : []; // Handle case where no files are uploaded

    // Validate if sizes is provided and is an array
    if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
      return res.status(400).json({ success: false, message: "Product must have at least one size with quantity." });
    }

    const newProduct = new productModel({
      category: CateGory,
      productName,
      material,
      sizes: sizes, // Assign the sizes array directly
      WithoutDiscountPrice,
      productPrice,
      rate,
      description,
      alreadySold: alreadySold || 0, // Default to 0 if not provided
      // available: available, // This is removed from schema, so remove here
      discount: discount || 0, // Default to 0 if not provided
      images,
    });

    const saved = await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ... (deleteProduct function - no changes needed here)
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

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      CateGory,
      productName,
      material,
      WithoutDiscountPrice,
      productPrice,
      rate,
      description,
      alreadySold,
      discount,
      sizesData, // Expecting sizesData for update as well
    } = req.body;

    const images = req.files ? req.files.map((file) => file.path) : [];
    let parsedSizes;
    try {
        parsedSizes = JSON.parse(sizesData); // Parse sizesData
        if (!Array.isArray(parsedSizes)) {
            return res.status(400).json({ success: false, message: "Sizes data must be a JSON array." });
        }
    } catch (parseError) {
        return res.status(400).json({ success: false, message: "Invalid JSON format for sizes data." });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        category: CateGory,
        productName,
        material,
        sizes: parsedSizes, // Update sizes array
        WithoutDiscountPrice,
        productPrice,
        rate,
        description,
        alreadySold,
        discount,
        ...(images.length > 0 && { images }),
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

// ... (decrementProductStock function - no changes needed here unless you want to formalize error messages)
const decrementProductStock = async (productId, size, quantityOrdered) => {
  try {
    const product = await productModel.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const sizeToUpdate = product.sizes.find((s) => s.size === size);

    if (!sizeToUpdate || sizeToUpdate.quantity < quantityOrdered) {
      throw new Error("Not enough stock for this size");
    }

    sizeToUpdate.quantity -= quantityOrdered;
    await product.save();
    return { success: true, message: "Stock decremented successfully" };
  } catch (error) {
    console.error("Decrement stock error:", error);
    return {
      success: false,
      message: error.message || "Failed to decrement stock",
    };
  }
};

// ... (getAllProducts function - no changes needed)
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ... (getProductById function - no changes needed)
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Get Single Product Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ... (getCatAllProducts function - no changes needed)
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

// ... (getRelatedProducts function - no changes needed)
const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const currentProduct = await productModel.findById(id);
    if (!currentProduct)
      return res.status(404).json({ message: "Product not found" });

    const related = await productModel
      .find({
        _id: { $ne: id },
        category: currentProduct.category,
      })
      .limit(4); // fetch max 4 related

    res.status(200).json({ success: true, products: related });
  } catch (err) {
    console.error("Related Product Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ... (addReview function - no changes needed)
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

// ... (deleteReview function - no changes needed)
const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    product.reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== reviewId
    );
    await product.save();
    res.json({ success: true, message: "Review deleted successfully!" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ... (getAllReviews function - no changes needed)
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

// ... (getCusAllReviews function - no changes needed)
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
        // Use productModel here, assuming it's the correct model for products
        const count = await productModel.countDocuments({ category: cat._id }); 
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


const notifyUsersForProduct = async (productId, size = null) => {
  try {
    const query = {
      productId,
      notified: false,
      ...(size && { size }),
    };

    const pendingRequests = await NotifyRequest.find(query);

    for (const request of pendingRequests) {
      await sendMail({
        to: request.email,
        subject: "🎉 Product is Back in Stock!",
        text: `The product you wanted is now available. Hurry up and order now!`,
      });

      request.notified = true;
      await request.save();
    }
  } catch (err) {
    console.error("Notification error:", err.message);
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
  decrementProductStock,
  getRelatedProducts,
};