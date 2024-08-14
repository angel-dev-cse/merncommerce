const fs = require("fs");
const path = require("path");

const ensureDirs = () => {
  // Needed directories
  __dirname = "";
  const directories = [
    path.join(__dirname, "uploads"),
    path.join(__dirname, "uploads", "temp"),
  ];
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o777 });
    }
  });
};

module.exports = { ensureDirs };
