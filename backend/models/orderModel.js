const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    paymentIntent: {
      id: { type: String, required: true },
      status: {
        type: String,
        default: "Pending",
        enum: [
          "Pending",
          "Processing",
          "Completed",
          "Failed",
          "Cancelled",
          "Refunded",
        ],
      },
      method: {
        type: String,
        required: true,
        default: "Cash on Delivery",
        enum: ["Cash on Delivery", "Card", "UPI", "Net Banking"],
      },
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
    },
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Cash on Delivery",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Completed",
      ],
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
