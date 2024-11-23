const CollectionCenter = require("../models/collection_center.model");

exports.create = async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name) throw new Error("Please provide name");
    if (!location) throw new Error("Please provide location");

    let collectionCenter = new CollectionCenter({ name, location });
    await collectionCenter.save();

    res.json({
      success: true,
      message: "Collection center created successfully",
      data: collectionCenter,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
