const cloudinary = require("../config/cloudinary");
const HeroSlider = require("../models/HeroSlider");
const uploadFromBuffer = require("../utils/streamUpload");

// Create Hero
exports.createHero = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Image is required" });

        const result = await uploadFromBuffer(cloudinary, req.file.buffer, "hero-slider");

        const hero = new HeroSlider({
            title: req.body.title,
            buttonText: req.body.buttonText,
            buttonLink: req.body.buttonLink,
            description: req.body.description,
            image: {
                url: result.secure_url,      // yahi URL website pe show hoga
                public_id: result.public_id, // delete/update ke liye
            },
        });

        await hero.save();
        res.status(201).json(hero);
    } catch (error) {
        console.error("Create Hero Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all heroes
exports.getAllHeroes = async (req, res) => {
    try {
        const heroes = await HeroSlider.find().sort({ createdAt: -1 });

        // Response cleanup (frontend ke liye)
        const formatted = heroes.map(hero => ({
            id: hero._id,
            title: hero.title,
            buttonText: hero.buttonText,
            buttonLink: hero.buttonLink,
            description: hero.description,
            imageUrl: hero.image?.url || null,   // 👈 yahi frontend me use hoga
            createdAt: hero.createdAt,
            updatedAt: hero.updatedAt
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get hero by ID
exports.getHeroById = async (req, res) => {
    try {
        const hero = await HeroSlider.findById(req.params.id);
        if (!hero) return res.status(404).json({ message: "Hero not found" });

        res.json({
            id: hero._id,
            title: hero.title,
            buttonText: hero.buttonText,
            buttonLink: hero.buttonLink,
            description: hero.description,
            imageUrl: hero.image?.url || null,   // 👈 direct image link
            createdAt: hero.createdAt,
            updatedAt: hero.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Update Hero
exports.updateHero = async (req, res) => {
    try {
        const hero = await HeroSlider.findById(req.params.id);
        if (!hero) return res.status(404).json({ message: 'Hero not found' });

        // Update text fields
        hero.title = req.body.title ?? hero.title;
        hero.buttonText = req.body.buttonText ?? hero.buttonText;
        hero.buttonLink = req.body.buttonLink ?? hero.buttonLink;
        hero.description = req.body.description ?? hero.description;

        // If new image provided, delete old from Cloudinary and upload new
        if (req.file) {
            // Delete old image
            if (hero.image && hero.image.public_id) {
                try {
                    await cloudinary.uploader.destroy(hero.image.public_id);
                } catch (err) {
                    console.warn('Failed to delete old image:', err.message);
                }
            }

            // Upload new image to Cloudinary
            const result = await uploadFromBuffer(cloudinary, req.file.buffer, 'hero-slider');
            hero.image = { url: result.secure_url, public_id: result.public_id };
        }

        await hero.save();

        // Response formatted for frontend
        res.json({
            id: hero._id,
            title: hero.title,
            buttonText: hero.buttonText,
            buttonLink: hero.buttonLink,
            description: hero.description,
            imageUrl: hero.image?.url || null,
            createdAt: hero.createdAt,
            updatedAt: hero.updatedAt
        });

    } catch (error) {
        console.error("Update Hero Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteHero = async (req, res) => {
    try {
        const hero = await HeroSlider.findById(req.params.id);
        if (!hero) return res.status(404).json({ message: 'Hero not found' });

        // Delete image from Cloudinary
        if (hero.image && hero.image.public_id) {
            try {
                const result = await cloudinary.uploader.destroy(hero.image.public_id);
                if (result.result !== "ok" && result.result !== "not found") {
                    console.warn('Failed to delete image from Cloudinary:', result);
                }
            } catch (err) {
                console.warn('Failed to delete image from Cloudinary:', err.message);
            }
        }

        // Delete hero document
        await HeroSlider.deleteOne({ _id: hero._id });

        res.json({
            message: 'Hero deleted successfully',
            heroId: hero._id,
            imageUrl: hero.image?.url || null
        });

    } catch (error) {
        console.error("Delete Hero Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};