const express = require("express");
const morgan = require("morgan");
const slugify = require("slugify");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const authRouter = require("./routes/authRoute.js");
const productRouter = require("./routes/productRoute.js");
const dbConnect = require("./config/dbConnect.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler.js");
const PORT = process.env.PORT || 4000;

dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
