const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");
const {
  createBlog,
  getBlog,
  getBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  attachImage,
} = require("../controller/blogController");
const router = express.Router();

router.get("/:id", getBlog);
router.get("/", getBlogs);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  upload.array("blog_image", 5),
  createBlog
);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
router.put("/like", authMiddleware, likeBlog);
router.put("/dislike", authMiddleware, dislikeBlog);
router.post("/image", upload.array("images", 5), attachImage);

module.exports = router;
