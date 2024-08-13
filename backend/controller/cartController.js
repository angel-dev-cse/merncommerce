const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const validateMongoID = require("../validations/validateMongoID");
const { cartSchema } = require("../validations/validationSchema");

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

module.exports = { addToCart, getCart, removeFromCart };
