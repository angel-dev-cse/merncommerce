const Product = require("../models/productModel.js");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

// create a product
const createProduct = asyncHandler(async (req, res) => {
  // slug is shorthand for a single product (!)
  if (req.body.title) {
    req.body.slug = slugify(req.body.title, {
      replacement: "-",
      lower: true,
      trim: true,
    });
  }
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

// update a single product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // slugify before inserting the update
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, {
        replacement: "-",
        lower: true,
        trim: true,
      });
    }

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json({ "Updated Prodct": product });
  } catch (error) {
    throw new Error(error);
  }
});

// fetch a single product
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const product = await Product.findById(id);
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

// fetch all the products
const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createProduct, getProduct, getProducts, updateProduct };
