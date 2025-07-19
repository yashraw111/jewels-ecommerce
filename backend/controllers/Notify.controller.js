const NotifyRequest = require("../models/NotifyRequest.model");

exports.addNotifyRequest = async (req, res) => {
  console.log(req.body)
  try {
    const { productId, size, email } = req.body;

    const alreadyExists = await NotifyRequest.findOne({ productId, size, email });
    if (alreadyExists) {
      return res.status(400).json({ success: false, message: "Already requested" });
    }

    const newReq = new NotifyRequest({ productId, size, email });
    await newReq.save();

    res.json({ success: true, message: "You will be notified when it's back in stock" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
