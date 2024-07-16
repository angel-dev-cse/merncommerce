const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
} = require("../controller/productController");

router.post("/create", createProduct);
router.get("/:id", getProduct);
router.get("/", getProducts);
router.put("/:id", updateProduct);

module.exports = router;
