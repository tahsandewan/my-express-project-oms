// src/controllers/user.controller.js

const User = require("../models/user.model");
var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var tokenGenerator = require('jsonwebtoken');
var tokenParser = require("express-jwt");
const jwt = require('jsonwebtoken');
const TOKEN_SECRET = 'THIS IS A SIMPLE PASSWORD TO SIGN TOKEN.';

function generateHash(password) {
    const hash = crypto.createHash('sha512');
    const hashedPassword = hash.update(password).digest("hex");
    
    return hashedPassword;
  }
  
  function generateAccessToken(user) {
    return tokenGenerator.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1800s" });
  }
  
  /* user login. */
exports.loginUser = async (req, res) => {
    User.findOne({ email: req.body["email"] })
      .then((user) => {
        if (!user) {
          res.status(404).send({
            status: 404,
            message: "No user found.",
          });
  
          return;
        }
  
        const password = req.body["password"];
        const hashedPassword = generateHash(password);
  
        if (user.hashedPassword !== hashedPassword) {
          res.status(401).send({
            status: 401,
            message: "Invalid credentials provided.",
          });
  
          return;
        }
  
        const token = generateAccessToken({
          _id: user._id,
          email: user.email,
          name: user.name,
        });
  
        res.status(200).send({
          status: 200,
          message: "User logged in successfully.",
          user: user,
          token: token,
        });
      })
      .catch((error) => {
        res.status(500).send({
          status: 500,
          message: `Login process failed unexpectedly.`,
        });
      });
  };


  /* POST user. */
  exports.registerUser = async (req, res) => {
    // try {
    // const { name, email, password,confirmPassword } = req.body;
    // console.log("register 22",password)

        
    // } catch (error) {
    // console.log("register err",error)
        
    // }
    const password = req.body['password'];
    const confirmPassword = req.body["confirmPassword"];
  
    if (password !== confirmPassword) {
      res.status(400).send({
        status: 400,
        message: `Password and confirm password do not match.`,
      });
    }
  
    const hashedPassword = generateHash(password);
    const user = new User({
      name: req.body["name"],
      email: req.body["email"],
      hashedPassword: hashedPassword,
    });
  
    user.save().then(() => {
      // sending response to user...
      res.status(200).send({
        status: 200,
        message: "Registration completed successfully.",
        user: user,
      });
    }).catch(error => {
      console.log(error);
  
      // duplicate key error...
      if (error.code === 11000) {
        res.status(400).send({
          status: 400,
          message: `Email id is already used.`,
        });
      }
  
      res.status(500).send({
        status: 500,
        message: `Registration process failed unexpectedly.`,
      });
    });
  };
  


// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    console.log("res try")

    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    console.log("res catch")

    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  console.log("reqqq",req)

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found 99" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user" });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const newUser = new User({ name, email, age });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Error creating user" });
    }
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
exports.searchUser = async (req, res) => {
    const query = req?.query?.search;
    // console.log("reqqq",query)
    console.log("reqqq 99",req?.query?.search)
  
      try {
        const page = parseInt(req.query.page) || 1; // default page 1
        const limit = parseInt(req.query.limit) || 10; // default 10 users per page
      
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;


          const results =  query? await User.find({
            $or: [  {name: { $regex: query, $options: 'i' }},{ email: { $regex: query, $options: "i" } }
            ] }):await User.find();;
          console.log("reqqq results",results)
           if (!results || results?.length == 0) return res.status(404).json({ error: "User not found" });

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