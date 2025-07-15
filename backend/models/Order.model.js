const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      size: { type: String },
      material: { type: String },
    },
  ],
  shippingInfo: {
    address: String,
    city: String,
    state: String,
    postalCode: String,
    phone: String,
  },
  totalPrice: { type: Number, required: true },
  paymentInfo: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
  },
status: {
  type: String,
  enum: ["Processing", "Shipped", "Out for delivery", "Delivered"], // <-- added here
  default: "Processing",
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
