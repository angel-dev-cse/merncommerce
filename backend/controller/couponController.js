const Coupon = require("../models/couponModel");
const Cart = require("../models/cartModel");
const validateMongoID = require("../validations/validateMongoID");
const { couponSchema } = require("../validations/validationSchema");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const { error } = couponSchema.validate(req.body);

  if(req.body.type === "percentage" && req.body.discount > 100) {
    return res.status(400).json({ error: "Discount cannot be more than 100%" });
  }
  
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  const coupon = await Coupon.create(req.body);
  res.status(200).json(coupon);
});

const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json(coupons);
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { error } = couponSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const { id } = req.params; // coupon id
  validateMongoID(id);

  const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });

  if (!coupon) {
    return res.status(404).json({ error: "Coupon not found" });
  }

  res.status(200).json({ message: "Coupon updated", coupon });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoID(id);

  const deletedCoupon = await Coupon.findByIdAndDelete(id);
  if (deletedCoupon) {
    res.status(200).json({ message: "Coupon Deleted", coupon: deletedCoupon });
  } else {
    throw new Error("Coupon doesn't exist!");
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({
    code,
    expiryDate: { $gte: new Date() },
  });

  if (!coupon) {
    return res.status(400).json({ error: "Coupon is not valid" });
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(400).json({ error: "Cart not found" });
  }

  const { totalPrice, discount } = cart;

  if (coupon.type === "percentage") {
    discount = (coupon.discount / 100) * totalPrice;
  } else {
    discount = coupon.discount;
  }
});

module.exports = { createCoupon, getCoupons, deleteCoupon, updateCoupon };
