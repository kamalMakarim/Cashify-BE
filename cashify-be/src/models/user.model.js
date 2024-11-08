const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    email:{
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
    phoneNumber:{
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["user", "merchant"],
        default: "user"
    }
});

module.exports = mongoose.model("User", UserSchema);
