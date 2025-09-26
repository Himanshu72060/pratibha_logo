// controllers/aboutController.js
const About = require('../models/About');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const streamifier = require('streamifier');



// Helper to remove temp file
const removeTmpFile = (path) => {
    fs.unlink(path, (err) => {
        if (err) console.warn('Failed to remove temp file', err.message);
    });
};


exports.createAbout = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!req.file) return res.status(400).json({ error: 'Image is required' });

        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    { folder: 'about_images' },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await streamUpload(req);

        const about = new About({
            title,
            description,
            image: { url: result.secure_url, public_id: result.public_id }
        });

        await about.save();
        res.status(201).json({ success: true, data: about });
    } catch (err) {
        console.error('Create About Error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllAbout = async (req, res) => {
    try {
        const list = await About.find().sort({ createdAt: -1 });
        res.json({ success: true, data: list });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.getAbout = async (req, res) => {
    try {
        const about = await About.findById(req.params.id);
        if (!about) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true, data: about });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update About
exports.updateAbout = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const about = await About.findById(id);
        if (!about) return res.status(404).json({ error: "About not found" });

        // agar nayi image bheji gayi hai
        if (req.file) {
            // Purani image delete karo
            if (about.image && about.image.public_id) {
                await cloudinary.uploader.destroy(about.image.public_id);
            }

            // Nayi image upload karo
            const result = await cloudinary.uploader.upload_stream(
                { folder: "about_images" },
                async (error, uploadResult) => {
                    if (error) return res.status(500).json({ error: "Image upload failed" });

                    about.title = title || about.title;
                    about.description = description || about.description;
                    about.image = {
                        url: uploadResult.secure_url,
                        public_id: uploadResult.public_id
                    };

                    const updated = await about.save();
                    res.json(updated);
                }
            );
        }
    } catch (err) {
        console.error('Update About Error:', err.message);
        res.status(500).json({ error: err.message });
    }
};


exports.deleteAbout = async (req, res) => {
    try {
        const about = await About.findById(req.params.id);
        if (!about) return res.status(404).json({ error: 'Not found' });

        // delete image from cloudinary
        await cloudinary.uploader.destroy(about.image.public_id);

        // delete from Mongo
        await About.deleteOne({ _id: about._id });

        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        console.error('Delete About Error:', err.message);
        res.status(500).json({ error: err.message });
    }
};