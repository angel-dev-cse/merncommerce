const Joi = require("joi");

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
  color: Joi.string().required()
})

module.exports = {
  productRatingSchema,
  couponSchema,
  blogSchema,
  productSchema,
  cartSchema,
};
