const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// saves images in cloudinary under blog folder
const uploadToBlog = async (filepath) => {
  console.log("uploading images to blog");
  return await cloudinary.uploader.upload(filepath, { folder: "blog" });
};

// saves images in cloudinary under products folder
const uploadToProduct = async (filepath) => {
  console.log("uploading images to products");
  return await cloudinary.uploader.upload(filepath, { folder: "products" });
};

module.exports = { uploadToBlog, uploadToProduct };
