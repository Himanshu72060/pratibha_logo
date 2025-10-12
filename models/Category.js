const mongoose = require('mongoose');


const CourseSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String },
    duration: { type: String },
    price: { type: String },
    image: { type: String }
}, { _id: false });


const CategorySchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    courses: { type: [CourseSchema], default: [] }
}, { timestamps: true });


module.exports = mongoose.model('Category', CategorySchema);