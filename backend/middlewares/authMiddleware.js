const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const verifiedSecret = jwt.verify(token, process.env.JWT_SECRET);

      if (verifiedSecret) {
        const user = await User.findById(verifiedSecret?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Authorization token expired! Please login again.");
    }
  } else {
    throw new Error("Not authorized!");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    throw new Error("Restricted operation!");
  }
  next();
});

module.exports = { authMiddleware, isAdmin };
