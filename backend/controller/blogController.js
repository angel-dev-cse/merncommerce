const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const validateMongoID = require("../utils/validateMongoID");
const asyncHandler = require("express-async-handler");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const blogContent = req.body;
    const blog = await Blog.create(blogContent);
    res.status(200).json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

const getBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (blog) res.status(200).json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

const getBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (blogs) res.status(200).json(blogs);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog Deleted", deletedBlog });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createBlog, getBlog, getBlogs, deleteBlog};
