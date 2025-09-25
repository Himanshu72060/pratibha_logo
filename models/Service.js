const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String, // Cloudinary URL
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
