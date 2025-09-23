const mongoose = require('mongoose');


const ImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    public_id: { type: String, required: true },
});


const HeroSliderSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        buttonText: { type: String },
        buttonLink: { type: String },
        description: { type: String },
        image: { type: ImageSchema, required: true },
    },
    { timestamps: true }
);


module.exports = mongoose.model('HeroSlider', HeroSliderSchema);