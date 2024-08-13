const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");
const {resizeBlogImages} = require("../middlewares/resizeMiddleware");
const {
  createBlog,
  getBlog,
  getBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
} = require("../controller/blogController");
const router = express.Router();

router.get("/:id", getBlog);
router.get("/", getBlogs);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  upload.array("blog_image", 5),
  resizeBlogImages,
  createBlog
);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
router.put("/like", authMiddleware, likeBlog);
router.put("/dislike", authMiddleware, dislikeBlog);

module.exports = router;

/*NOTE TO SELF
uploadMiddleware uses multer to upload images to the server in /uploads folder
"images" is the key in the form-data and 5 is the maximum number of images
resizeMiddleware then resizes the images in /uploads/temp folder
cloudinaryService then uploads the images to cloudinary (blog folder)
blogController then saves the image URLs in the database
finally we remove the images using fs.unlinkSync in blogController
*/
