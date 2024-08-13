const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      index: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: [],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    address: {
      type: String,
    },
    token: {
      type: String,
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetTokenExpiresIn: Date,
  },
  { timestamps: true }
);

// encrypt the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordMatched = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

// generate reset password token
userSchema.methods.generateResetPasswordToken = async function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetTokenExpiresIn = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

  return token;
};

//Export the model
module.exports = mongoose.model("User", userSchema);
