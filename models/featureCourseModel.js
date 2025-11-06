const mongoose = require('mongoose');

const featureCourseSchema = new mongoose.Schema({
    id: { type: String, default: () => new Date().getTime().toString() },
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true }
});

module.exports = mongoose.model('FeatureCourse', featureCourseSchema);
