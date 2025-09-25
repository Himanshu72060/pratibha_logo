const Partner = require('../models/partnerModel');
const cloudinary = require('../config/cloudinary');

// CREATE Partner
exports.createPartner = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Image is required' });

        const result = await cloudinary.uploader.upload_stream(
            { folder: 'partners' },
            async (error, result) => {
                if (error) return res.status(500).json({ error: error.message });

                const partner = new Partner({
                    image: result.secure_url,
                });
                await partner.save();
                res.status(201).json(partner);
            }
        );
        result.end(req.file.buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET All Partners
exports.getPartners = async (req, res) => {
    try {
        const partners = await Partner.find();
        res.status(200).json(partners);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET Single Partner
exports.getPartner = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);
        if (!partner) return res.status(404).json({ error: 'Partner not found' });
        res.status(200).json(partner);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE Partner
exports.updatePartner = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);
        if (!partner) return res.status(404).json({ error: 'Partner not found' });

        // Update image if new file uploaded
        if (req.file) {
            const result = await cloudinary.uploader.upload_stream(
                { folder: 'partners' },
                async (error, result) => {
                    if (error) return res.status(500).json({ error: error.message });
                    partner.image = result.secure_url;
                    await partner.save();
                    res.status(200).json(partner);
                }
            );
            result.end(req.file.buffer);
        } else {
            await partner.save();
            res.status(200).json(partner);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE Partner
exports.deletePartner = async (req, res) => {
    try {
        const partner = await Partner.findByIdAndDelete(req.params.id);
        if (!partner) return res.status(404).json({ error: 'Partner not found' });
        res.status(200).json({ message: 'Partner deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

