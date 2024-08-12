const sharp = require("sharp");
const fs = require("fs");

// ensure that /uploads/temp folder exists
if (!fs.existsSync("/uploads/temp")) {
  fs.mkdirSync("/uploads/temp", { recursive: true });
}

const resizeBlogImages = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/temp/${file.filename}`);

      // will be used to remove images from //uploads and //uploads/temp folder
      // in the controller
      file.parent_path = file.path;
      file.path = `uploads/temp/${file.filename}`;
    })
  );

  next();
};

const resizeProductImages = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/${file.filename}`);
    })
  );
};

const resizeProfilePicture = async (req, res, next) => {
  if (!req.file) return next();
  await sharp(req.file.path)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/${req.file.filename}`);
};

module.exports = {
  resizeBlogImages,
  resizeProductImages,
  resizeProfilePicture,
};
