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
    validateMongoID(id);

    const blog = await Blog.findById(id).populate("likes").populate("dislikes");
    if (blog) res.status(200).json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

const getBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find().populate("likes").populate("dislikes");
    if (blogs) res.status(200).json(blogs);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoID(id);

    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (deletedBlog) {
      res.status(200).json({ message: "Blog Deleted", blog: deletedBlog });
    } else {
      throw new Error("Blog doesn't exist!");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const likeBlog = asyncHandler(async (req, res) => {
  /* if "like" is clicked --
  1) If already liked then remove the like
  2) If already disliked then remove the dislike + add like */
  try {
    const { blogID } = req.body; // blog id
    const { _id } = req?.user?._id; // logged in user id
    validateMongoID(blogID);
    validateMongoID(_id);

    let blog = await Blog.findById(blogID);

    const isLiked = blog?.likes?.some(
      // userID is just temp value while iterating through values - returns Boolean
      (userID) => userID.toString() === _id.toString()
    );

    const isDisliked = blog?.dislikes?.some(
      // userID is just temp value while iterating through values - returns Boolean
      (userID) => userID.toString() === _id.toString()
    );

    // if already disliked then remove the user from dislikes and add user to likes
    if (isDisliked) {
      let blog = await Blog.findByIdAndUpdate(
        blogID,
        {
          $pull: { dislikes: _id },
          isDisliked: false,
          $push: { likes: _id },
          isLiked: true,
        },
        { new: true }
      );

      res.json(blog);
    }

    // if already liked then remove the user from likes otherwise add the user to likes
    if (isLiked) {
      let blog = await Blog.findByIdAndUpdate(
        blogID,
        {
          $pull: { likes: _id },
          isLiked: false,
        },
        { new: true }
      );

      res.json(blog);
    } else {
      let blog = await Blog.findByIdAndUpdate(
        blogID,
        {
          $push: { likes: _id },
          isLiked: true,
        },
        { new: true }
      );

      res.json(blog);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogID } = req.body;
  validateMongoID(blogID);
  const { _id } = req.user._id;

  let blog = await Blog.findById(blogID);

  // check if user liked the blog already
  // I forgot blog schema has isLiked and isDisliked variables maybe use those now
  // this is more efficient when the blog has many likes or dislikes
  // const isLiked = blog?.likes?.some(
  //   (userID) => userID.toString() === _id.toString()
  // );

  // if not liked or disliked then add to dislike list
  if (!blog.isLiked && !blog.isDisliked) {
    let blog = await Blog.findByIdAndUpdate(
      blogID,
      {
        $push: { dislikes: _id },
        isDisliked: true,
      },
      {
        new: true,
      }
    );

    res.json(blog);
  } else if (blog.isLiked) {
    // if liked already, then remove from the liked list and add to dislike list
    let blog = await Blog.findByIdAndUpdate(
      blogID,
      {
        $pull: { likes: _id },
        $push: { dislikes: _id },
        isLiked: false,
        isDisliked: true,
      },
      {
        new: true,
      }
    );

    res.json(blog);
  } else {
    // if disliked already, remove from dislikes
    let blog = await Blog.findByIdAndUpdate(
      blogID,
      {
        $pull: { dislikes: _id },
        isDisliked: false,
      },
      {
        new: true,
      }
    );

    res.json(blog);
  }
});

module.exports = { createBlog, getBlog, getBlogs, deleteBlog, likeBlog, dislikeBlog };
