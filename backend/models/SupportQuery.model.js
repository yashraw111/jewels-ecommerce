const mongoose_query = require("mongoose");

const supportQuerySchema = new mongoose_query.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  queryType: {
    type: String,
    required: true,
    enum: ["Product Inquiry", "Order Status", "Payment Issue", "Other"],
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    default: "New",
    enum: ["New", "In Progress", "Resolved"],
  },
}, { timestamps: true });

const SupportQuery = mongoose_query.model("SupportQuery", supportQuerySchema);

module.exports = SupportQuery