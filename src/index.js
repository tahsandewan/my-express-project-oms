// src/index.js

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require('path');
dotenv.config();
const app = express();
const verifyToken = require('./middlewares/authMiddleware');
// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

// Connect to MongoDB



 connectDB();
console.log("calling from index")

// Routes
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order",verifyToken, orderRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});