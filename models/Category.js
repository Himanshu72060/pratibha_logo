const mongoose = require('mongoose');


const CourseSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: String,
    duration: String,
    price: String,
    image: {
        url: String,
        public_id: String
    }
});


const CategorySchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    image: String,
    courses: [CourseSchema]
});


module.exports = mongoose.model('Category', CategorySchema);