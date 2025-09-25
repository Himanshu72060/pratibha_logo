const Counter = require("../models/counterModel");
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const fs = require("fs");

// Create Counter
exports.createCounter = async (req, res) => {
    try {
        let imageUrl = "";

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "counters",
            });
            imageUrl = result.secure_url;
        }

        const counter = await Counter.create({
            name: req.body.name,
            number: req.body.number,
            image: imageUrl,
        });

        fs.unlinkSync(req.file.path); // remove temp file
        res.status(201).json(counter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get all counters
exports.getAllCounters = async (req, res) => {
    try {
        const counters = await Counter.find();
        res.status(200).json(counters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get single counter
exports.getSingleCounter = async (req, res) => {
    try {
        const counter = await Counter.findById(req.params.id);
        if (!counter) return res.status(404).json({ error: "Counter not found" });
        res.status(200).json(counter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// update counter
exports.updateSingleCounter = async (req, res) => {
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


// delete counter
exports.deleteSingleCounter = async (req, res) => {
    try {
        const counter = await Counter.findById(req.params.id);
        if (!counter) return res.status(404).json({ error: "Counter not found" });
        await counter.remove();
        res.status(200).json({ message: "Counter deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};