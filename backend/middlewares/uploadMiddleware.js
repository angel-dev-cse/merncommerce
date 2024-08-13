const multer = require("multer");
const path = require("path");
const fs = require("node:fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // temporary storage before uploading files to cloudinary
    // we will reisze the images in this "uploads" folder
    cb(null, `uploads/`);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`
    );
  },
});

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "File type not supported" }, false);
  }
};

const upload = multer({
  storage: storage,
  filter: filter,
  limits: { fileSize: 5000000 }, // Max 1MB image size
});

module.exports = { upload };
