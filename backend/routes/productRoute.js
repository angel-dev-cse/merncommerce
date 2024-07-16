const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");

router.post("/create", authMiddleware, isAdmin, createProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.get("/:id", authMiddleware, getProduct);
router.get("/", authMiddleware, getProducts);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
