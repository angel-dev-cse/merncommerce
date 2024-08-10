const mongoose = require("mongoose");

const validateMongoID = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) {
    throw new Error("Mongoose error: Invalid ID");
  }
};

module.exports = validateMongoID;
