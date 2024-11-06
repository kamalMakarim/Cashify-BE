const mongoose = require("mongoose");

const CollectionCenterSchema = new mongoose.Schema({
  // Define your schema fields here, e.g.,
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  cans: {
    type: Number,
    required: true,
    default: 0,
  },
  bottles: {
    type: Number,
    required: true,
    default: 0,
  }
});

module.exports = mongoose.model("collection_center", CollectionCenterSchema);
