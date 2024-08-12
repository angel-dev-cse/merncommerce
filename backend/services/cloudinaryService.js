const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const uploadToBlog = async (filepath) => {
  console.log("uploading");
  return await cloudinary.uploader.upload(filepath, { folder: "blog" });
};

module.exports = { uploadToBlog };
