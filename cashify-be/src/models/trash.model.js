const mongoose =  require("mongoose");

const TrashSchema = new mongoose.Schema({
    trashType: {
        type: String,
        enum: ["cardboard", "glass", "metal", "paper", "plastic", "trash"],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    collected_at: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CollectionCenter",
    }
});

module.exports = mongoose.model("Trash", TrashSchema);