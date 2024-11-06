const mongoose =  require("mongoose");

const TrashSchema = new mongoose.Schema({
    trashType: {
        type: String,
        enum: ["cans", "bottles", "glass", "cardboard"],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    collected_at: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CollectionCenter",
    }
});

module.exports = mongoose.model("Trash", TrashSchema);