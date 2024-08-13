const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  removeFromCart,
  emptyCart,
  applyCoupon,
} = require("../controller/cartController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.get("/empty", authMiddleware, emptyCart);
router.delete("/:id", authMiddleware, removeFromCart);
router.post("/coupon", authMiddleware, applyCoupon);

module.exports = router;
