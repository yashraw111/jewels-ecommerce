const Razorpay = require("razorpay");
const shortid = require("shortid");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100, // convert to paise
    currency: "INR",
    receipt: shortid.generate(),
    payment_capture: 1, // auto capture
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json({
      success: true,
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    console.log("Razorpay Error:", err);
    res.status(500).json({ success: false, message: "Razorpay error" });
  }
};
