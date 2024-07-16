const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProduct,
  getProducts,
} = require("../controller/productController");

router.post("/create", createProduct);
router.get("/:id", getProduct);
router.get("/", getProducts);

module.exports = router;
