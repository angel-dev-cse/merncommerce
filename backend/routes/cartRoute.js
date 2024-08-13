const express = require("express");
const router = express.Router();

const { addToCart } = require("../controller/cartController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/add", authMiddleware, addToCart);

module.exports = router;
