const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon
} = require("../controller/couponController");
const router = express.Router();

router.get("/", authMiddleware, isAdmin, getCoupons);
router.post("/", authMiddleware, isAdmin, createCoupon);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
