const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema(
    {
        image: { type: String, required: true }, // Cloudinary URL
    },
    { timestamps: true }
);

module.exports = mongoose.model("Logo", logoSchema);
