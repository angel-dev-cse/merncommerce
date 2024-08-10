const Category = require("../models/productCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoID = require("../validations/validateMongoID");

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);

  res.send(category);
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoID(id);
  const category = await Category.findById(id);
  res.send(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const title = req.body?.title;

  validateMongoID(id);
  const category = await Category.findByIdAndUpdate(
    id,
    { title: title },
    {
      new: true,
    }
  );
  res.send(category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoID(id);
  const category = await Category.findByIdAndDelete(id);
  res.status(201).json({ message: "Delete successful!", category: category });
});

module.exports = { createCategory, getCategories, getCategory, updateCategory, deleteCategory };
