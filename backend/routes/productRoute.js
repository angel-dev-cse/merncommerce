const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");
const { resizeProductImages } = require("../middlewares/resizeMiddleware");

const {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rateProduct,
} = require("../controller/productController");

router.post(
  "/create",
  authMiddleware,
  isAdmin,
  upload.array("images", 5),
  resizeProductImages,
  createProduct
);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.get("/:id", authMiddleware, getProduct);
router.get("/", authMiddleware, getProducts);
router.post("/rate", authMiddleware, rateProduct);
router.post("/wishlist", authMiddleware, addToWishlist);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
