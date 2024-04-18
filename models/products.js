const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_Name: {
    type: String,
    required: true,
  },
  product_information: {
    type: String,
    required: true,
  },
  product_image: {
    type: String,
    required: true,
  },
  product_createdAt: {
    type: Date,
    default: Date.now()
  },
});

const Product = mongoose.model("products", productSchema);

module.exports = Product;
