const mongoose = require("mongoose");

const notifyRequestSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  size: String, // optional: if size specific
  email: {
    type: String,
    required: true,
  },
  notified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("NotifyRequest", notifyRequestSchema);
