const Service = require('../models/Service');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create Service
exports.createService = async (req, res) => {
    try {
        console.log("Incoming body:", req.body);
        console.log("Incoming file:", req.file);

        if (!req.file) {
            return res.status(400).json({ error: 'Image is required, got nothing' });
        }

        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'services' });

        const service = await Service.create({
            name: req.body.name,
            image: result.secure_url
        });

        res.status(201).json(service);
    } catch (error) {
        console.error("❌ Error in createService:", error);
        res.status(500).json({ error: error.message });
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
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ error: 'Service not found' });

        // Optional: delete image from Cloudinary (needs public_id)
        // await cloudinary.uploader.destroy(service.public_id);

        await service.remove();
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
