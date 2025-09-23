const Logo = require("../models/Logo");
const cloudinary = require("../config/cloudinary");

// ✅ Create Logo
exports.createLogo = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "logos",
        });

        const logo = new Logo({
            name: req.body.name,
            image: result.secure_url,
        });

        await logo.save();
        res.status(201).json(logo);
    } catch (err) {
        res.status(500).json({ error: err.message });
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
        let updateData = { name: req.body.name };

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
