const Product = require("../models/productModel.js");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { caseIRegex } = require("../utils/helper.js");
const { productSchema } = require("../validations/validationSchema.js");
const validateMongoID = require("../validations/validateMongoID.js");
const { productRatingSchema } = require("../validations/validationSchema.js");

// create a product
const createProduct = asyncHandler(async (req, res) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.message });
  }

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
    let query = { ...req.query };

    // this field shouldn't be used in parsing
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((field) => {
      delete query[field];
    });

    // make the query object string in order to replace the number keys i.e. gte to $gte
    query = JSON.stringify(query);

    query = JSON.parse(
      query.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    );

    // convert appropriate fields into case insensitive regex
    query = caseIRegex(query);
    console.log("Mongo Query:", query);

    // get actual query to do sort, select and pagination
    query = Product.find(query);

    // sorting by fileds
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      // default sort by creation time
      query = query.sort("createdAt");
    }

    // select fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      // don't show the mongoose's __v field (default)
      query = query.select("-__v");
    }

    // pagination - default values (page:1, limit: 0)

    const productCount = await Product.countDocuments();
    const page = req.query?.page || 1;
    const limit = req.query.limit || 0;
    const skip = (page - 1) * limit;

    if (skip >= productCount) {
      throw new Error("Page does not exist!");
    }

    query = query.skip(skip).limit(limit);

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

// add to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { id } = req.body; // product ID
  const _id = req.user._id; // user ID

  validateMongoID(id);

  let user = await User.findById(_id);

  // check if the product is already in the wishlist
  const isWishlisted = user?.wishlist?.some(
    (productID) => productID.toString() === id.toString()
  );

  console.log(isWishlisted);
  // return;

  if (isWishlisted) {
    // remove from the wishlist
    user = await User.findByIdAndUpdate(
      _id,
      {
        $pull: { wishlist: id },
      },
      { new: true }
    );

    res
      .status(201)
      .json({ message: "Product removed from the wishlist!", user: user });
  } else {
    // add product to the wishlist
    user = await User.findByIdAndUpdate(
      _id,
      {
        $push: { wishlist: id },
      },
      { new: true }
    );

    res
      .status(201)
      .json({ message: "Product added to the wishlist!", user: user });
  }
});

// @desc Rate a product
const rateProduct = asyncHandler(async (req, res) => {
  // findByIdAndUpdate requires {runValidators: true} to run the mongoose validations!!!
  // updateOne bypasses validation
  const { error } = productRatingSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.message });
  }
  const { star, review, id } = req.body; // rating star and product ID
  const { _id } = req.user; // user ID

  validateMongoID(id);

  let product = await Product.findById(id);

  // get the rating object if already rated
  const rating = product?.ratings?.find(
    (rating) => rating?.postedBy?.toString() === _id.toString()
  );

  if (rating) {
    // update the rating - pull out the past one and push the new
    // updateOne doesn't return the updated product so instead using findOneAndUpdate
    // must provide the product ID as many product can have the same ratings by the same user
    product = await Product.findOneAndUpdate(
      {
        _id: id,
        ratings: { $elemMatch: rating },
      },
      {
        // "ratings.$.star" refers to the first matched element (mongoDB operator $)
        $set: { "ratings.$.star": star, "ratings.$.review": review },
      },
      { new: true, runValidators: true }
    );
  } else {
    // add new rating
    product = await Product.findByIdAndUpdate(
      id,
      {
        $push: {
          ratings: {
            star: star,
            review: review,
            postedBy: _id,
          },
        },
      },
      { new: true, runValidators: true }
    );
  }

  // update the average rating at the same time
  const totalRating = product?.ratings
    ?.map((rating) => rating.star)
    .reduce((total, curr) => total + curr);

  const avgRating = Math.floor(totalRating / product.ratings.length);

  product = await Product.findByIdAndUpdate(
    id,
    {
      rating: avgRating,
    },
    { new: true }
  );

  res.status(200).json({
    message: `You rated the ${product.title} with ${star} stars!`,
    product: product,
  });
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rateProduct,
};
