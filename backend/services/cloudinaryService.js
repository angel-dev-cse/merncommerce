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
  // use sharp to resize image before uploading
  // const image = await sharp(filepath)
  //   .resize(300, 300)
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toBuffer();
  return await cloudinary.uploader.upload(filepath, { folder: "blog" });
};

// saves images in cloudinary under products folder
const uploadToProducts = async (filepath) => {
  console.log("uploading images to products");
  // use sharp to resize image before uploading
  // const image = await sharp(filepath)
  //   .resize(500, 500)
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toBuffer();
  return await cloudinary.uploader.upload(filepath, { folder: "products" });
};

module.exports = { uploadToBlog, uploadToProducts };
