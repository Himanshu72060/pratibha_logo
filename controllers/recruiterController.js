const Recruiter = require("../models/recruiterModel");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");


// Create Recruiter
exports.createRecruiter = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "prime_recruiters",
        });

        const recruiter = new Recruiter({
            image: result.secure_url,
        });

        await recruiter.save();
        res.status(201).json(recruiter);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all recruiters
exports.getRecruiters = async (req, res) => {
    try {
        const recruiters = await Recruiter.find();
        res.status(200).json(recruiters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single recruiter
exports.getRecruiterById = async (req, res) => {
    try {
        const recruiter = await Recruiter.findById(req.params.id);
        if (!recruiter) return res.status(404).json({ error: "Recruiter not found" });
        res.status(200).json(recruiter);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update recruiter
exports.updateRecruiter = async (req, res) => {
    try {
        const recruiter = await Recruiter.findById(req.params.id);
        if (!recruiter) return res.status(404).json({ error: "Recruiter not found" });

        if (req.file) {
            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "prime_recruiters",
            });
            recruiter.image = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        await recruiter.save();
        res.status(200).json(recruiter);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete recruiter
exports.deleteRecruiter = async (req, res) => {
    try {
        const recruiter = await Recruiter.findById(req.params.id);
        if (!recruiter) return res.status(404).json({ error: "Recruiter not found" });

        await recruiter.remove();
        res.status(200).json({ message: "Recruiter deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
