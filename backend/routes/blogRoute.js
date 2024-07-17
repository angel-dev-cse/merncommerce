const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createBlog,
  getBlog,
  getBlogs,
  deleteBlog,
} = require("../controller/blogController");
const router = express.Router();

router.get("/:id", getBlog);
router.get("/", getBlogs);
router.post("/", authMiddleware, isAdmin, createBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
