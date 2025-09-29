const Logo = require("../models/Logo");
const cloudinary = require("../config/cloudinary");

// ✅ Create Logo
// POST - Add new logo
exports.createLogo = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "Image is required" });

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "logos",
        });

        const logo = await Logo.create({
            image: { public_id: result.public_id, url: result.secure_url },
        });

        res.status(201).json(logo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ✅ Get All Logos
exports.getLogos = async (req, res) => {
    try {
        const logos = await Logo.find();
        res.json(logos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Update Logo
exports.updateLogo = async (req, res) => {
    try {

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "logos",
            });
            updateData.image = result.secure_url;
        }

        const logo = await Logo.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
        });

        res.json(logo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Delete Logo
exports.deleteLogo = async (req, res) => {
    try {
        await Logo.findByIdAndDelete(req.params.id);
        res.json({ message: "Logo deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
