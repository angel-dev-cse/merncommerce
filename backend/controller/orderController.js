const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const asyncHandler = require("express-async-handler");
const {
  paymentSchema,
  paymentStatusSchema,
  orderStatusSchema,
} = require("../validations/validationSchema");
const validateMongoID = require("../validations/validateMongoID");
const uniqid = require("uniqid");

// @desc    Create order
// @route   POST /api/order
// @access  Private
// @role    User
// @validation  paymentIntent
const createOrder = asyncHandler(async (req, res) => {
  const { error } = paymentSchema.validate(req.body);
  if (error) {
    return res.status(500).json({ message: error.message });
  }
  const { _id } = req.user;
  validateMongoID(_id);

  const { status, method, currency } = req.body.paymentIntent;

  const cart = await Cart.findOne({ user: _id });
  if (cart?.products?.length <= 0) throw new Error("Cart is empty!");

  const order = new Order({
    products: cart.products,
    user: _id,
    paymentIntent: {
      id: uniqid(),
      status,
      method,
      amount: cart.totalPrice,
      currency,
    },
  });

  await order.save();

  // reset cart
  cart.products = [];
  cart.totalPrice = 0;
  cart.discount = 0;
  cart.appliedCoupon = null;
  await cart.save();

  res.status(201).json({ message: "Order created!", order: order });
});

// @desc    Get order
// @route   GET /api/order/:id
// @access  Private
// @role    User
// @validation  _id, id
const getOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoID(_id);
  validateMongoID(req.params.id);

  const order = await Order.findById(req.params.id);
  if (!order) throw new Error("Order not found!");

  if (order.user.toString() !== _id.toString()) {
    throw new Error("Unauthorized access!");
  }

  res.status(200).json({ order });
});

// @desc    Get orders
// @route   GET /api/order
// @access  Private
// @role    User
// @validation  _id
const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoID(_id);

  const orders = await Order.find({ user: _id });
  res.json({ orders });
});

// @desc   Cancel order
// @route  PUT /api/order/:id/cancel
// @access Private
// @role   User
// @validation _id, id
const cancelOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoID(_id);

  const { id } = req.params;
  validateMongoID(id);

  const order = await Order.findById(id);
  if (!order) throw new Error("Order not found!");

  if (order.user.toString() !== _id.toString()) {
    throw new Error("Unauthorized access!");
  }

  if (order.orderStatus === "Cancelled") {
    return res.json({ message: "Order already cancelled!", order });
  }

  order.orderStatus = "Cancelled";
  await order.save();

  res.status(201).json({ message: "Order cancelled!", order });
});

// @desc   Update order status
// @route  PUT /api/order/:id
// @access Private
// @role   Admin
// @validation _id, id, orderStatus
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { error } = orderStatusSchema.validate(req.body);
  if (error) {
    return res.status(500).json({ message: error.message });
  }

  const { _id } = req.user;
  validateMongoID(_id);
  const { id } = req.params;
  validateMongoID(id);

  const order = await Order.findById(id);
  if (!order) throw new Error("Order not found!");

  order.orderStatus = req.body.orderStatus;
  await order.save();

  res.status(201).json({ message: `Order status updated to ${order.orderStatus}!`, order });
});

// @desc   Update payment status
// @route  PUT /api/order/payment/:id
// @access Private
// @role   Admin
// @validation _id, id, status
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { error } = paymentStatusSchema.validate(req.body);
  if (error) {
    return res.status(500).json({ message: error.message });
  }

  const { _id } = req.user;
  validateMongoID(_id);
  const { id } = req.params;
  validateMongoID(id);
  
  const { status } = req.body;

  const order = await Order.findById(id);

  if (!order) throw new Error("Order not found!");

  order.paymentIntent.status = status;

  await order.save();

  res.status(201).json({ message: "Payment status updated!", order });
});

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  cancelOrder,
  updateOrderStatus,
  updatePaymentStatus,
};
