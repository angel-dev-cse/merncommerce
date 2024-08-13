const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const authRouter = require("./routes/authRoute.js");
const productRouter = require("./routes/productRoute.js");
const blogRouter = require("./routes/blogRoute.js");
const productCategoryRouter = require("./routes/productCategoryRoute.js");
const couponRouter = require("./routes/couponRoute.js");

const dbConnect = require("./config/dbConnect.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler.js");
const PORT = process.env.PORT || 4000;

dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// see requests in bash?!
app.use(morgan("dev"));

app.use("/api/user", authRouter);
app.use("/api/product/category", productCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/coupon", couponRouter);

app.use(notFound);
app.use(errorHandler);

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
