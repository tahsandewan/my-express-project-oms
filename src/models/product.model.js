const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  category: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs or file paths
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
