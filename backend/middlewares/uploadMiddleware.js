const multer = require("multer");
const path = require("path");
const fs = require("node:fs");

if (!fs.existsSync("uploads/")) {
  fs.mkdir("uploads/", { recursive: false });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `uploads/`); // temporary storage before uploading files to cloudinary
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

const upload = multer({ storage: storage });

module.exports = { upload };
