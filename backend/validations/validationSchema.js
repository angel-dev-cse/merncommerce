const Joi = require("joi");
const mongoose = require("mongoose");

// function to validate mongo id
const validateMongoID = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) {
    throw new Error("Mongoose error: Invalid ID");
  }
};

// schema for validating product rating using JOI (server side)
const productRatingSchema = Joi.object({
  star: Joi.number().integer().min(1).max(5).required(),
  review: Joi.string().min(2).required(),
  id: Joi.string(), // not checking mongoose id as it's checked in validateMongoID
});

const couponSchema = Joi.object({
  code: Joi.string().min(2).required(),
  type: Joi.string().valid("percentage", "fixed").required(),
  expiry: Joi.date().required(),
  discount: Joi.number().integer().min(1).required(),
});

const blogSchema = Joi.object({
  title: Joi.string().min(2).required(),
  description: Joi.string().min(20).required(),
  category: Joi.string(),
});

const productSchema = Joi.object({
  title: Joi.string().min(2).required(),
  category: Joi.string().required(),
  brand: Joi.string().required(),
  color: Joi.string().required(),
  price: Joi.number().integer().min(1).required(),
  description: Joi.string().min(20).required(),
});

const cartSchema = Joi.object({
  id: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  color: Joi.string().required(),
});

const paymentSchema = Joi.object({
  paymentIntent: Joi.object({
    status: Joi.string()
      .valid(
        "Pending",
        "Processing",
        "Completed",
        "Failed",
        "Cancelled",
        "Refunded"
      )
      .required(),
    method: Joi.string()
      .valid("Cash on Delivery", "Card", "UPI", "Net Banking")
      .required(),
    currency: Joi.string().required(),
  }),
});

const orderStatusSchema = Joi.object({
  orderStatus: Joi.string()
    .valid(
      "Not Processed",
      "Processing",
      "Dispatched",
      "Cancelled",
      "Completed"
    )
    .required(),
});

const paymentStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "Pending",
      "Processing",
      "Completed",
      "Failed",
      "Cancelled",
      "Refunded"
    )
    .required(),
});

module.exports = {
  validateMongoID,
  productRatingSchema,
  couponSchema,
  blogSchema,
  productSchema,
  cartSchema,
  paymentSchema,
  orderStatusSchema,
  paymentStatusSchema,
};
