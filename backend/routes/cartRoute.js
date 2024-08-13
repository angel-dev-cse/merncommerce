const express = require("express");
const router = express.Router();

const { addToCart, getCart } = require("../controller/cartController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);

module.exports = router;
