const express = require("express");
const router = express.Router();

const { createOrder, getOrder, getOrders, cancelOrder, updateOrderStatus } = require("../controller/orderController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrder);
router.get("/:id", authMiddleware, getOrders);
router.delete("/:id", authMiddleware, cancelOrder);
router.put("/:id", authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;
