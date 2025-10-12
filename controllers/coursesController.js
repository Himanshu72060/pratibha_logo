const Category = require('../models/Category');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');
const path = require('path');


// Helper to upload local file to Cloudinary and remove local file
async function uploadToCloudinary(localPath, folder = 'courses') {
    try {
        const res = await cloudinary.uploader.upload(localPath, { folder });
        // remove temp file
        fs.unlink(localPath, (err) => { if (err) console.warn('Temp file remove error', err); });
        return { url: res.secure_url, public_id: res.public_id };
    } catch (err) {
        // try to remove local file
        fs.unlink(localPath, () => { });
        throw err;
    }
}

exports.createCategory = async (req, res) => {
    try {
        const { id, name } = req.body;
        if (!id || !name) return res.status(400).json({ message: 'id and name required' });


        let imageUrl = null;
        if (req.file) {
            const upload = await uploadToCloudinary(req.file.path, 'categories');
            imageUrl = upload.url;
        }


        const category = new Category({ id: Number(id), name, image: imageUrl, courses: [] });
        await category.save();
        res.status(201).json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({ success: true, data: categories });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getCategoryById = async (req, res) => {
    try {
        const cat = await Category.findOne({ id: Number(req.params.id) });
        if (!cat) return res.status(404).json({ message: 'Category not found' });
        res.json({ success: true, data: cat });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// Add a course to a category (image file optional)
exports.addCourse = async (req, res) => {
    try {
        const categoryId = Number(req.params.id);
        const { id, name, description, duration, price } = req.body;
        if (!id || !name) return res.status(400).json({ message: 'course id and name required' });

        const cat = await Category.findOne({ id: categoryId });
        if (!cat) return res.status(404).json({ message: 'Category not found' });

        let imageObj = null;
        if (req.file) {
            const up = await uploadToCloudinary(req.file.path, `courses/category-${categoryId}`);
            imageObj = up;
        }

        const course = {
            id: Number(id),
            name,
            description,
            duration,
            price,
            image: imageObj
        };

        cat.courses.push(course);
        await cat.save();
        res.status(201).json({ success: true, data: course });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// Update category (including replacing category image)
exports.updateCategory = async (req, res) => {
    try {
        const cat = await Category.findOne({ id: Number(req.params.id) });
        if (!cat) return res.status(404).json({ message: 'Category not found' });

        if (req.body.name) cat.name = req.body.name;
        if (req.file) {
            const up = await uploadToCloudinary(req.file.path, 'categories');
            cat.image = up.url;
        }

        await cat.save();
        res.json({ success: true, data: cat });
    } catch (err) { res.status(500).json({ message: err.message }); }
};


// Update a course (including its image)
exports.updateCourse = async (req, res) => {
    try {
        const cat = await Category.findOne({ id: Number(req.params.id) });
        if (!cat) return res.status(404).json({ message: 'Category not found' });

        const courseId = Number(req.params.courseId);
        const course = cat.courses.find(c => c.id === courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        ['name', 'description', 'duration', 'price'].forEach(field => { if (req.body[field]) course[field] = req.body[field]; });

        if (req.file) {
            const up = await uploadToCloudinary(req.file.path, `courses/category-${cat.id}`);
            course.image = up;
        }

        await cat.save();
        res.json({ success: true, data: course });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// Delete a course (and optionally delete Cloudinary image by public_id if present)
exports.deleteCourse = async (req, res) => {
    try {
        const cat = await Category.findOne({ id: Number(req.params.id) });
        if (!cat) return res.status(404).json({ message: 'Category not found' });

        const courseId = Number(req.params.courseId);
        const idx = cat.courses.findIndex(c => c.id === courseId);
        if (idx === -1) return res.status(404).json({ message: 'Course not found' });

        const [removed] = cat.courses.splice(idx, 1);
        await cat.save();

        if (removed.image && removed.image.public_id) {
            try { await cloudinary.uploader.destroy(removed.image.public_id); } catch (e) { console.warn('Cloudinary destroy failed', e.message); }
        }

        res.json({ success: true, message: 'Course deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// Delete entire category (and images cleanup optional)
exports.deleteCategory = async (req, res) => {
    try {
        const cat = await Category.findOne({ id: Number(req.params.id) });
        if (!cat) return res.status(404).json({ message: 'Category not found' });

        // try delete images for courses
        for (const c of cat.courses) {
            if (c.image && c.image.public_id) {
                try { await cloudinary.uploader.destroy(c.image.public_id); } catch (e) { console.warn('destroy err', e.message) }
            }
        }

        // no category-level public_id stored; if you store it, delete it here
        await cat.remove();
        res.json({ success: true, message: 'Category deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};