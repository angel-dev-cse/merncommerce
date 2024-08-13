const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getUser,
  deleteUser,
  getAllUsers,
  updateUser,
  addAddress,
  blockUser,
  unblockUser,
  verifyToken,
  logoutUser,
  updatePassword,
  requestPasswordReset,
  resetPassword
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);
router.get("/logout", logoutUser);
router.get("/vToken", verifyToken);
router.put("/update", authMiddleware, updateUser);
router.post("/update-address", authMiddleware, addAddress);
router.put("/password", authMiddleware, updatePassword);
router.get("/all-users", authMiddleware, isAdmin, getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.put("/block/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock/:id", authMiddleware, isAdmin, unblockUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

module.exports = router;
