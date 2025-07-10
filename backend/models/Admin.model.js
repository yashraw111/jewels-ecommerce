const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  confirmPassword: {
    type: String,
    trim: true,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin; // ✅ Yeh karo
