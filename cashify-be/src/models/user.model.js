const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ["user", "merchant"],
        default: "user"
    }
});

module.exports = mongoose.model("User", UserSchema);
