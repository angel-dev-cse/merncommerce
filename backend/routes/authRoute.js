const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getUser,
  deleteUser,
  getAllUsers,
  updateUser,
  blockUser,
  unblockUser,
  verifyToken,
  logoutUser
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/vToken", verifyToken);
router.put("/update", authMiddleware, updateUser);
router.get("/all-users", authMiddleware, isAdmin, getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.put("/block/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock/:id", authMiddleware, isAdmin, unblockUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

module.exports = router;
