// models/Course.js
const mongoose = require('mongoose');


const CourseSchema = new mongoose.Schema({
    categoryName: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: String },
    price: { type: Number, default: 0 },
    imageCategory: {
        url: { type: String },
        public_id: { type: String },
    },
    image: {
        url: { type: String },
        public_id: { type: String },
    },
}, { timestamps: true });


module.exports = mongoose.model('Course', CourseSchema);