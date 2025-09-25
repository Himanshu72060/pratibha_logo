const Service = require('../models/Service');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const fs = require("fs");

// Create Counter
exports.createCounter = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Image is required" });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "counters",
        });

        const counter = await Counter.create({
            name: req.body.name,
            number: req.body.number,
            image: result.secure_url,
        });

        fs.unlinkSync(req.file.path); // remove temp file
        res.status(201).json(counter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Counters
exports.getCounters = async (req, res) => {
    try {
        const counters = await Counter.find();
        res.status(200).json(counters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Counter
exports.updateCounter = async (req, res) => {
    try {
        const counter = await Counter.findById(req.params.id);
        if (!counter) return res.status(404).json({ error: "Counter not found" });

        // Update image if file exists
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "counters",
            });
            counter.image = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        counter.name = req.body.name || counter.name;
        counter.number = req.body.number || counter.number;

        await counter.save();
        res.status(200).json(counter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Counter
exports.deleteCounter = async (req, res) => {
    try {
        const counter = await Counter.findById(req.params.id);
        if (!counter) return res.status(404).json({ error: "Counter not found" });

        await counter.remove();
        res.status(200).json({ message: "Counter deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
