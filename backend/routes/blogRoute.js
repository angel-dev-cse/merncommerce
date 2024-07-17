const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createBlog,
  getBlog,
  getBlogs,
  deleteBlog,
} = require("../controller/blogController");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.get("/:id", getBlog);
router.get("/", getBlogs);
router.delete("/:id", deleteBlog);

module.exports = router;
