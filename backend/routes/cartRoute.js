const express = require("express");
const router = express.Router();

const { addToCart, getCart, removeFromCart } = require("../controller/cartController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/:id", authMiddleware, removeFromCart);

module.exports = router;
