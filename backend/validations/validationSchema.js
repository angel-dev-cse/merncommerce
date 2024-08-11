const Joi = require("joi");

// schema for validating product rating using JOI (server side)
const productRatingSchema = Joi.object({
  star: Joi.number().integer().min(1).max(5).required(),
  review: Joi.string().min(2).required(),
  id: Joi.string(), // not checking mongoose id as it's checked in validateMongoID
});

const couponSchema = Joi.object({
  name: Joi.string().min(2).required(),
  expiry: Joi.date().required(),
  discount: Joi.number().integer().min(1).max(100).required(),
});

const blogSchema = Joi.object({
  title: Joi.string().min(2).required(),
  description: Joi.string().min(20).required(),
  category: Joi.string(),
});


module.exports = {
  productRatingSchema,
  couponSchema,
  blogSchema
};
