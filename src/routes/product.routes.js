
const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// router.get("/", userController.getAllUsers);
// router.get("/search", userController.searchUser);
 router.get("/all-products", productController.allProducts);

//  router.get("/:id", productController.getProduct);
router.post("/", productController.createProduct);
// router.put("/:id", userController.updateUser);
// router.delete("/:id", userController.deleteUser);

module.exports = router;