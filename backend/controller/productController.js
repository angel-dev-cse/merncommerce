const Product = require("../models/productModel.js");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { caseIRegex } = require("../utils/helper.js");

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
    // could be done in this way but not efficient
    // const products = await Product.find({
    //   brand: req.query.brand,
    //   color: req.query.color,
    // });

    let query = { ...req.query };
    console.log("Raw query", query);

    // this field shouldn't be used in parsing
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((field) => {
      delete query[field];
    });

    // make the query object string in order to replace the number keys
    query = JSON.stringify(query);

    query = JSON.parse(
      query.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    );

    // convert appropriate fields into case insensitive regex
    query = caseIRegex(query);

    const products = await Product.find(query);

    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

// delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    res.json({ "Deleted Product": product });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
