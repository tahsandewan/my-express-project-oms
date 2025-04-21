
const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
 router.get("/all-products", productController.allProducts);
router.post("/", productController.createProduct);

module.exports = router;