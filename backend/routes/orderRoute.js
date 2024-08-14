const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrder,
  getOrders,
  cancelOrder,
  updateOrderStatus,
  updatePaymentStatus,
} = require("../controller/orderController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrder);
router.put("/:id/cancel", authMiddleware, cancelOrder);
router.put("/:id/update-status", authMiddleware, isAdmin, updateOrderStatus);
router.put("/:id/update-payment-status", authMiddleware, isAdmin, updatePaymentStatus);

module.exports = router;
