const Highlight = require('../models/Highlight');
const cloudinary = require('../config/cloudinary');

// Utility function to upload buffer to Cloudinary
const uploadBufferToCloudinary = async (buffer, folder) => {
    try {
        const result = await cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error) throw new Error('Cloudinary upload error');
            return result;
        });
        buffer.pipe(result);
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};
exports.createHighlight = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });
        if (!req.file) return res.status(400).json({ error: 'Image file is required' });
        if (!highlight) return res.status(404).json({ error: 'Highlight not found' });


        // Update title if provided
        if (title) highlight.title = title;


        // If new image provided, delete old image from Cloudinary and upload new
        if (req.file) {
            // delete old
            try {
                await cloudinary.uploader.destroy(highlight.image.public_id);
            } catch (e) {
                console.warn('Cloudinary delete warning:', e.message);
            }


            const result = await uploadBufferToCloudinary(req.file.buffer, 'key_highlights');
            highlight.image = { url: result.secure_url, public_id: result.public_id };
        }


        await highlight.save();
        return res.json({ message: 'Highlight updated', highlight });
    } catch (err) {
        console.error('Update Highlight Error:', err);
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
};


exports.deleteHighlight = async (req, res) => {
    try {
        const { id } = req.params;
        const highlight = await Highlight.findById(id);
        if (!highlight) return res.status(404).json({ error: 'Highlight not found' });


        // delete from cloudinary
        try {
            await cloudinary.uploader.destroy(highlight.image.public_id);
        } catch (e) {
            console.warn('Cloudinary delete warning:', e.message);
        }


        await highlight.remove();
        return res.json({ message: 'Highlight deleted' });
    } catch (err) {
        console.error('Delete Highlight Error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};