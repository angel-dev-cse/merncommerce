const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const { validateMongoID, cartSchema } = require("../validations/validationSchema");

// @desc    Add product to cart or update quantity
// @route   POST /api/cart
// @access  Private
// @role    User
// @validation  id, quantity, color
const addToCart = asyncHandler(async (req, res) => {
  const { error } = cartSchema.validate(req.body);
  if (error) {
    return res.status(500).json({ message: error.message });
  }

  const { _id } = req.user;
  validateMongoID(_id);

  const { id, quantity, color } = req.body;

  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found!");

  const cart = await Cart.findOne({ user: _id });
  if (cart) {
    const productExist = cart.products.find(
      (p) => p.id.toString() === id.toString()
    );
    if (productExist) {
      productExist.quantity = quantity;
      productExist.color = color;
    } else {
      cart.products.push({
        id,
        quantity,
        color,
        price: product.price,
      });
    }
    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    await cart.save();
    res.json({ message: "Product added to cart!", cart: cart });
  } else {
    const cart = new Cart({
      user: _id,
      products: [{ id, quantity, color, price: product.price }],
      totalPrice: product.price * quantity,
    });
    await cart.save();
    res.json({ message: "Product added to cart!", cart: cart });
  }
});

// @desc   Get cart
// @rotue GET /api/cart
// @access Private
// @role   User
const getCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoID(_id);

  const cart = await Cart.findOne({ user: _id }).populate("products.id");
  if (!cart) throw new Error("Cart not found!");

  res.status(200).json(cart);
});

// @desc   Remove product from cart
// @route  DELETE /api/cart/:id
// @access Private
// @role   User
// @validation id, _id
const removeFromCart = asyncHandler(async (req, res) => {
  // _id is user id
  const { _id } = req.user;
  validateMongoID(_id);
  // id is product id
  const { id } = req.params;
  validateMongoID(id);

  const cart = await Cart.findOne({ user: _id });
  if (!cart) throw new Error("Cart not found!");

  const productIndex = cart.products.findIndex(
    (p) => p.id.toString() === id.toString()
  );
  if (productIndex === -1) throw new Error("Product not found in cart!");

  cart.products.splice(productIndex, 1);
  cart.totalPrice = cart.products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  await cart.save();
  res.json({ message: "Product removed from cart!", cart: cart });
});

// @desc   Empty cart
// @route  DELETE /api/cart
// @access Private
// @role User
// @validation _id
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoID(_id);

  const cart = await Cart.findOne({ user: _id });
  if (!cart) throw new Error("Cart not found!");

  cart.products = [];
  cart.totalPrice = 0;
  cart.discount = 0;
  cart.appliedCoupon = null;

  await cart.save();
  res.json({ message: "Cart emptied!", cart: cart });
});

// @desc   Apply coupon
// @route  POST /api/cart/coupon
// @access Private
// @role   User
// @validation code
const applyCoupon = asyncHandler(async (req, res) => {
  const code = req.body.code.toUpperCase();
  console.log(code);
  const coupon = await Coupon.findOne({
    code,
  });

  if (!coupon) {
    return res.status(400).json({ error: "Coupon is not valid" });
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(400).json({ error: "Cart not found" });
  }

  let { totalPrice, discount, appliedCoupon } = cart;

  if (appliedCoupon) {
    return res.status(400).json({ error: "Coupon already applied" });
  }

  if (coupon.type === "percentage") {
    discount = (coupon.discount / 100) * totalPrice;
  } else {
    discount = coupon.discount;
  }

  cart.discount = discount;
  cart.appliedCoupon = coupon._id;
  await cart.save();
  res.status(200).json({ message: "Coupon applied successfully", cart });
});

module.exports = { addToCart, getCart, removeFromCart, emptyCart, applyCoupon };
