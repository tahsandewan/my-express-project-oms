const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    customer_name: String,
    order_date: { type: Date, default: Date.now },
    total_price: Number,
    products: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number,
      },
    ],
  });
  
  const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
  