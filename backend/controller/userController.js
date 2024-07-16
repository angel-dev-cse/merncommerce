const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const validateMongoID = require("../utils/validateMongoID");
const { generateToken, refreshToken } = require("../config/jwt");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    // create a new user
    const user = await User.create(req.body);
    res.json({ message: "User successfully created!", User: user });
  } else {
    /* res.json({
        message: "User already exists!",
        success: false,
      }); */
    throw new Error("User already exists!");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.isPasswordMatched(password))) {
    const token = refreshToken(user?._id);

    user.token = token;
    const updatedUser = await user.save();

    /* const updatedUser = await User.findByIdAndUpdate(
      user?._id,
      {
        token: token,
      },
      { new: true }
    ); */

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({ user: updatedUser });
  } else {
    throw new Error("Invalid credentials!");
  }
});

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoID(id);
  const user = await User.findById(id);

  if (!user) throw new Error(`User not found with ID: ${id}`);

  res.json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoID(id);
  // todo: NOT DELETING NOW
  const user = await User.findById(id);

  if (!user) throw new Error(`User not found with ID: ${id}`);

  res.json({ Message: "Successfully deleted!", User: user });
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoID(id);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );

    res.json({ message: "User blocked!", user: user });
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoID(id);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );

    res.json({ message: "User unblocked!", user: user });
  } catch (error) {
    throw new Error(error);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoID(id);
  const user = await User.findByIdAndUpdate(
    _id,
    {
      firstname: req?.body?.firstname,
      lastname: req?.body?.lastname,
      email: req?.body?.email,
      mobile: req?.body?.mobile,
    },
    {
      new: true,
    }
  );

  if (!user) throw new Error(`User not found with ID: ${id}`);

  res.json({ Message: "Successfully updated!", User: user });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

const verifyToken = asyncHandler(async (req, res) => {
  // cookie parser should be enabled in index.js
  const cookie = req.cookies;

  console.log(cookie);

  if (!cookie?.token) {
    throw new Error("No token found!");
  }

  const token = cookie?.token;

  const user = await User.findOne({ token: token });

  if (!user) {
    throw new Error("Invalid token!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("Invalid personal token!");
    }

    const accessToken = generateToken(decoded?.id);
    res.json({ access_token: accessToken });
  });
});

// update password token
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoID(_id);

  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    await user.save();
    res.json("Password updated successfully!");
  } else {
    res.json("No password specified!");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.token) {
    throw new Error("Invalid Token!");
  }

  const token = req.cookies.token;

  console.log(token);

  const user = User.findOne({ token: token });
  if (!user) {
    // if no valid user is found
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });

    return res.sendStatus(204); // forbidden and logged out (clearly false token)
  }

  // reset the token to log the user out
  // --not using the returened value so {new:true} isn't being used
  await User.findOneAndUpdate(
    { token },
    {
      token: "",
    }
  );
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });

  console.log("User logged out!");

  return res.sendStatus(204); // forbidden and logged out
});

module.exports = {
  createUser,
  loginUser,
  getUser,
  deleteUser,
  updateUser,
  getAllUsers,
  blockUser,
  unblockUser,
  updatePassword,
  logoutUser,
  verifyToken,
};
