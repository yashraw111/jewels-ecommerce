const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
    required: true,
    trim: true,
  },
  fullName: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  }],
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
