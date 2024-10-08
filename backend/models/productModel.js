const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      // type: mongoose.Schema.Types.ObjectId,
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
      // enum: ["Apple", "Samsung", "Microsoft"],
    },
    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [],
    color: {
      type: String,
      required: true,
      // enum: ["Black", "Brown", "Red"],
    },
    ratings: [
      {
        star: {
          type: Number,
          required: true,
        },
        review: {
          type: String,
          required: true,
        },
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    // average rating (floor - probably for showing the star count)
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
