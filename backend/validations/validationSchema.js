const Joi = require("joi");

// schema for validating product rating using JOI (server side)
const productRatingSchema = Joi.object({
  star: Joi.number().integer().min(1).max(5).required(),
  review: Joi.string().min(2).required(),
  id: Joi.string(), // not checking mongoose id as it's checked in validateMongoID
});

module.exports = {
  productRatingSchema,
};
