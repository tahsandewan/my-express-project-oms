// src/controllers/user.controller.js

const Product = require("../models/product.model");
const multer = require('multer');
const path = require('path');

const upload = require('../config/upload');
// Get all users
// exports.getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find();
//         res.status(200).json(users);
//     console.log("res try")

//     } catch (error) {
//         res.status(500).json({ error: "Error fetching users" });
//     console.log("res catch")

//     }
// };

// Get user by ID
exports.getProduct = async (req, res) => {
  console.log("vvvvvvvvvvvvvv",req.params.id)

    try {
        const productById = await Product.findById(req.params.id);
  console.log("req.params.id productById:",productById)

        if (!productById) return res.status(404).json({ error: "Product not found" });
        res.status(200).json(productById);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Product" });
    }
};

// Create a new user

exports.createProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
    try {
        const { name, price, description,color,category } = req.body;
        // const images = req.files ? req.files.map(file => file.path) : [];
        const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        const newProduct = new Product({ name, price, description,color,category,images });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.log("creating error ",error)
        res.status(500).json({ error: "Error creating user" });
    }
});
};

// Update user by ID
exports.updateUser = async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email, age }, { new: true });
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Error updating user" });
    }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting user" });
    }
};
//Search user by name/email
exports.allProducts = async (req, res) => {
    const query = req?.query?.search;
    // console.log("reqqq",query)
    console.log("reqqq 99",req?.query?.search)
  
      try {
        const page = parseInt(req.query.page) || 1; // default page 1
        const limit = parseInt(req.query.limit) || 10; // default 10 users per page
      
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;


          const results =  query? await Product.find({
            $or: [  {name: { $regex: query, $options: 'i' }},{ description: { $regex: query, $options: "i" } },{ category: { $regex: query, $options: "i" } }
            ] }):await Product.find();;
          console.log("reqqq results",results)
           if (!results || results?.length == 0) return res.status(404).json({ error: "Product not found" });

           const paginatedUsers = results.slice(startIndex, endIndex);
    
           const totalPages = Math.ceil(results.length / limit);
           res.status(200).json({
            page,
            limit,
            totalPages,
            totalUsers: results?.length,
            data: paginatedUsers
          });

         
      } catch (error) {
          res.status(500).json({ error: "Error fetching user" });
      }
  };


  const users = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`
  }));

  exports.paginatedUserAll = async (req, res) => { 
    console.log("calling")
    try {
        const page = parseInt(req.query.page) || 1; // default page 1
        const limit = parseInt(req.query.limit) || 10; // default 10 users per page
      
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
      
        const paginatedUsers = users.slice(startIndex, endIndex);
    
        const totalPages = Math.ceil(users.length / limit);
    
      res.json({
        page,
        limit,
        totalPages,
        totalUsers: users.length,
        data: paginatedUsers
      });
    } catch (error) {
        res.status(500).json({ error: "Error fetching user" });
        
    }
   

  }