const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    WithoutDiscountPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    material: {
      type: String,
      enum: ["18k Gold", "22k Gold", "Rose Gold"],
      required: true,
    },
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL"],
      required: true,
    },
    reviews: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }
]
,
    images: [
      {
        type: String, // Cloudinary URLs
        required: true,
      },
    ],
    alreadySold: {
      type: Number,
      default: 0,
    },
    available: {
      type: Number,
      default: 1,
    },
    rate: {
      type: Number,
      default: 4.5,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
