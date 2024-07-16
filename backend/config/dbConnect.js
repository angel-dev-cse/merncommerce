const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  try {
    const conn = mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MONGODB successfully!");
  } catch (err) {
    console.log(`MONGODB connection error: ${err}`);
  }
};

module.exports = dbConnect;