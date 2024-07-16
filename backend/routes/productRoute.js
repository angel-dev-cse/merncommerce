const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
} = require("../controller/productController");

router.post("/create", authMiddleware, isAdmin, createProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.get("/:id", authMiddleware, getProduct);
router.get("/", authMiddleware, getProducts);

module.exports = router;
