const HeroSlider = require('../models/HeroSlider');
const cloudinary = require('../config/cloudinary');
const uploadFromBuffer = require('../utils/streamUpload');


// Create
exports.createHero = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Image is required' });


        const result = await uploadFromBuffer(cloudinary, req.file.buffer, 'hero-slider');


        const hero = new HeroSlider({
            title: req.body.title,
            buttonText: req.body.buttonText,
            buttonLink: req.body.buttonLink,
            description: req.body.description,
            image: { url: result.secure_url, public_id: result.public_id },
        });


        await hero.save();
        res.status(201).json(hero);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all
exports.getAllHeroes = async (req, res) => {
    try {
        const heroes = await HeroSlider.find().sort({ createdAt: -1 });
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get by id
exports.getHeroById = async (req, res) => {
    try {
        const hero = await HeroSlider.findById(req.params.id);
        if (!hero) return res.status(404).json({ message: 'Hero not found' });
        res.json(hero);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update
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
            // delete old
            if (hero.image && hero.image.public_id) {
                try {
                    await cloudinary.uploader.destroy(hero.image.public_id);
                } catch (err) {
                    console.warn('Failed to delete old image:', err.message);
                }
            }


            const result = await uploadFromBuffer(cloudinary, req.file.buffer, 'hero-slider');
            hero.image = { url: result.secure_url, public_id: result.public_id };
        }


        await hero.save();
        res.json(hero);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete
exports.deleteHero = async (req, res) => {
    try {
        const hero = await HeroSlider.findById(req.params.id);
        if (!hero) return res.status(404).json({ message: 'Hero not found' });


        // remove image from cloudinary
        if (hero.image && hero.image.public_id) {
            try {
                await cloudinary.uploader.destroy(hero.image.public_id);
            } catch (err) {
                console.warn('Failed to delete image from Cloudinary:', err.message);
            }
        }


        await hero.remove();
        res.json({ message: 'Hero removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};