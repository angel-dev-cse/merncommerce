const sharp = require("sharp");
const fs = require("fs");

const resizeBlogImages = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/temp/${file.filename}`);

      // MANDATORY: clear sharp cache
      sharp.cache(false);

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
        .withMetadata({ orientation: null })
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/temp/${file.filename}`);

      // MANDATORY: clear sharp cache
      sharp.cache(false);

      //delete the original file only and only after the resizing is done
      file.parent_path = file.path;
      file.path = `uploads/temp/${file.filename}`;
    })
  );

  next();
};

const resizeProfilePicture = async (req, res, next) => {
  if (!req.file) return next();
  await sharp(req.file.path)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/${req.file.filename}`);

  next();
};

module.exports = {
  resizeBlogImages,
  resizeProductImages,
  resizeProfilePicture,
};
