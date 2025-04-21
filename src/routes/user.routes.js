
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", userController.getAllUsers);
router.get("/search", userController.searchUser);
router.get("/all-users", userController.paginatedUserAll);

router.get("/:id", userController.getUserById);
router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;