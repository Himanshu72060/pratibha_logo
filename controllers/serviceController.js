const Service = require('../models/Service');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');


// Create Service
exports.createService = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "Services",
        });

        const service = new Service({
            name: req.body.name,
            image: result.secure_url,
        });

        await service.save();
        res.status(201).json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All Services
exports.getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Service
exports.getService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ error: 'Service not found' });
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Service
exports.updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ error: 'Service not found' });

        // Update name
        if (req.body.name) service.name = req.body.name;

        // Update image if new file uploaded
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'services' });
            service.image = result.secure_url;
        }

        await service.save();
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Service
exports.deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: "Service deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
