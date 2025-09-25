const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
    image: { type: String, required: true } // Cloudinary URL
}, { timestamps: true });

module.exports = mongoose.model("Recruiter", recruiterSchema);
