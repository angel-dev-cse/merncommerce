const express = require("express");
const router = express.Router();

const { createOrder, getOrder, getOrders, cancelOrder, updateOrderStatus } = require("../controller/orderController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrder);
router.delete("/:id", authMiddleware, cancelOrder);
router.put("/:id", authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;
