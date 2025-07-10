const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  cat_name: {
    type: String,
    required: true,
  },
  cat_image: {
    type: String, // will store Cloudinary URL
    required: true,
  },
});

module.exports = mongoose.model('Category', categorySchema);
