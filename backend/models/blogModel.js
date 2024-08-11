const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: 0,
    },
    isDisliked: {
      type: Boolean,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    images: [],
    author: {
      type: String,
      default: "Admin",
    },
  },
  {
    toJson: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

blogSchema.pre("save", function (next) {
  if (this.images.length === 0) {
    this.images.push(
      "https://1.bp.blogspot.com/-Jhpy04ZhmE0/Xv4gV129WuI/AAAAAAAAdWc/bgamvFHRnj4b5n3B6q3xDb1rLvQZdyjCwCK4BGAsYHg/w625-h313/blog-49006_960_720.png"
    );
  }
  next();
});

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
