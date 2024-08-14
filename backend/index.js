const express = require("express");
const morgan = require("morgan");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoute.js");
const productRouter = require("./routes/productRoute.js");
const blogRouter = require("./routes/blogRoute.js");
const productCategoryRouter = require("./routes/productCategoryRoute.js");
const couponRouter = require("./routes/couponRoute.js");
const cartRouter = require("./routes/cartRoute.js");
const orderRouter = require("./routes/orderRoute.js");

const PORT = process.env.PORT || 4000;

// helpers and middlewares
const dbConnect = require("./config/dbConnect.js");
const { notFound, errorHandler } = require("./middlewares/errorHandler.js");
const { ensureDirs } = require("./utils/dirHelper.js");

// connect to the mongoose database
dbConnect();
// makes sure some directories exists before proceeding 
ensureDirs();

// APP setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// see requests in bash?!
app.use(morgan("dev"));

// ROUTE setup
app.use("/api/user", authRouter);
app.use("/api/product/category", productCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// MIDDLEWARE setup
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
