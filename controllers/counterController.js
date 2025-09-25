const Counter = require("../models/counterModel");
const cloudinary = require('../config/cloudinary');
const fs = require("fs");

// Create Counter
const createCounter = async (req, res) => {
    try {
        const { title, value } = req.body;
        let imageUrl = "";  // Initialize imageUrl

        // Handle image upload if file is provided          
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'counters', // Optional: specify a folder in Cloudinary
            });
            imageUrl = result.secure_url;
            // Remove the file from local uploads folder after upload
            fs.unlinkSync(req.file.path);
        }
        const newCounter = new Counter({ title, value, image: imageUrl });
        await newCounter.save();
        res.status(201).json(newCounter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Counters
const getCounters = async (req, res) => {
    try {
        const counters = await Counter.find();
        res.status(200).json(counters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Counter
const updateCounter = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, value } = req.body;
        let updatedData = { title, value };
        // Handle image upload if file is provided
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'counters', // Optional: specify a folder in Cloudinary
            });
            updatedData.image = result.secure_url;
            // Remove the file from local uploads folder after upload
            fs.unlinkSync(req.file.path);
        }
        await Counter.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json({ message: "Counter updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Delete Counter
const deleteCounter = async (req, res) => {
    try {   
        const { id } = req.params;
        await Counter.findByIdAndDelete(id);
        res.status(200).json({ message: "Counter deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    createCounter,
    getCounters,
    updateCounter,
    deleteCounter
};