
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const multer = require('multer');
const path = require('path');

exports.createOrder = async (req, res) => {
    
    try {
        const { customer_name, products } = req.body;
        // Calculate total price for the order
        let total_price = 0;
        for (let product of products) {
          const dbProduct = await Product.findById(product.product_id);
          if (!dbProduct) {
            return res.status(404).json({ error: 'Product not found' });
          }
    
          total_price += dbProduct.price * product.quantity;
        }
    
        // Create the order
        const order = new Order({
          customer_name,
          total_price,
          products: products.map(product => ({
            product_id: product.product_id,
            quantity: product.quantity,
            price: product.price,
          })),
        });
    
        await order.save();
        res.status(201).json(order);
      } catch (error) {
        console.log("error",error)
        res.status(500).json({ error: 'Server Error' });
      }
};