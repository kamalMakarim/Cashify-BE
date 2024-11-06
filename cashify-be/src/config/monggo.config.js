const mongoose = require("mongoose");

exports.connectDB = async function () {
  const URI = process.env.MONGODB_URI;
  const connectionParams = {};

  mongoose.set("strictQuery", false);

  mongoose
    .connect(URI, connectionParams)
    .then(() => console.info("Connected to monggodb"))
    .catch((err) => console.error("Error" + err.message));
};