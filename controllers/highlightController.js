const Highlight = require('../models/Highlight');
const cloudinary = require('../config/cloudinary');

// helper: upload buffer to cloudinary
function uploadBufferToCloudinary(buffer, folder = 'key_highlights') {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
}

const createHighlight = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });
        if (!req.file) return res.status(400).json({ error: 'Image is required' });

        const result = await uploadBufferToCloudinary(req.file.buffer);

        const highlight = new Highlight({
            title,
            image: { url: result.secure_url, public_id: result.public_id },
        });

        await highlight.save();
        res.status(201).json({ message: 'Highlight created', highlight });
    } catch (err) {
        console.error('Create Highlight Error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const getAllHighlights = async (req, res) => {
    try {
        const highlights = await Highlight.find().sort({ createdAt: -1 });
        res.json({ highlights });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getHighlightById = async (req, res) => {
    try {
        const highlight = await Highlight.findById(req.params.id);
        if (!highlight) return res.status(404).json({ error: 'Not found' });
        res.json({ highlight });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const updateHighlight = async (req, res) => {
    try {
        const highlight = await Highlight.findById(req.params.id);
        if (!highlight) return res.status(404).json({ error: 'Not found' });

        if (req.body.title) highlight.title = req.body.title;

        if (req.file) {
            try {
                await cloudinary.uploader.destroy(highlight.image.public_id);
            } catch (e) {
                console.warn('Cloudinary delete warning:', e.message);
            }
            const result = await uploadBufferToCloudinary(req.file.buffer);
            highlight.image = { url: result.secure_url, public_id: result.public_id };
        }

        await highlight.save();
        res.json({ message: 'Updated', highlight });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const deleteHighlight = async (req, res) => {
    try {
        const highlight = await Highlight.findById(req.params.id);
        if (!highlight) return res.status(404).json({ error: 'Not found' });

        try {
            await cloudinary.uploader.destroy(highlight.image.public_id);
        } catch (e) {
            console.warn('Cloudinary delete warning:', e.message);
        }

        await highlight.deleteOne();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// 👇 EXPORT ALL FUNCTIONS IN ONE OBJECT
module.exports = {
    createHighlight,
    getAllHighlights,
    getHighlightById,
    updateHighlight,
    deleteHighlight,
};
