const mongoose = require('mongoose');


const highlightSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    image: {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
    },
}, { timestamps: true });


module.exports = mongoose.model('Highlight', highlightSchema);