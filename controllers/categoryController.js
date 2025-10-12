const Category = require('../models/Category');
const cloudinary = require('../config/cloudinaryConfig');
const streamifier = require('streamifier');

// helper: upload buffer to cloudinary using upload_stream
const uploadBufferToCloudinary = (buffer, folder = 'courses') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

exports.createCategory = async (req, res) => {
    try {
        const { id, name } = req.body;
        if (!id || !name) return res.status(400).json({ error: 'id and name are required' });


        let imageUrl;
        if (req.file) {
            const result = await uploadBufferToCloudinary(req.file.buffer, 'categories');
            imageUrl = result.secure_url;
        }


        const category = new Category({
            id: Number(id),
            name,
            image: imageUrl || req.body.image || '',
            courses: []
        });


        await category.save();
        res.status(201).json({ success: true, data: category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const cats = await Category.find().sort({ id: 1 });
        res.json({ success: true, data: cats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const cat = await Category.findOne({ id });
        if (!cat) return res.status(404).json({ error: 'Category not found' });
        res.json({ success: true, data: cat });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const cat = await Category.findOne({ id });
        if (!cat) return res.status(404).json({ error: 'Category not found' });


        if (req.file) {
            // remove previous image if exists (extract public_id if present)
            if (cat.image) {
                // try to parse public_id from URL — best-effort using cloudinary's folder/filename format.
                // If you stored public_id, prefer to save it in DB; here we only attempt best-effort deletion.
            }
            const result = await uploadBufferToCloudinary(req.file.buffer, 'categories');
            cat.image = result.secure_url;
        }


        if (req.body.name) cat.name = req.body.name;
        if (req.body.image && !req.file) cat.image = req.body.image;


        await cat.save();
        res.json({ success: true, data: cat });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const cat = await Category.findOneAndDelete({ id });
        if (!cat) return res.status(404).json({ error: 'Category not found' });
        // Note: cloudinary deletion would require storing public_id; skipping robust delete here.
        res.json({ success: true, message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Courses inside a category
exports.addCourse = async (req, res) => {
    try {
        const catId = Number(req.params.id);
        const cat = await Category.findOne({ id: catId });
        if (!cat) return res.status(404).json({ error: 'Category not found' });


        const { id, name, description, duration, price } = req.body;
        if (!id || !name) return res.status(400).json({ error: 'course id and name required' });


        let imageUrl = '';
        if (req.file) {
            const result = await uploadBufferToCloudinary(req.file.buffer, `categories/${catId}/courses`);
            imageUrl = result.secure_url;
        }


        const newCourse = {
            id: Number(id),
            name,
            description: description || '',
            duration: duration || '',
            price: price || '',
            image: imageUrl || req.body.image || ''
        };


        cat.courses.push(newCourse);
        await cat.save();
        res.status(201).json({ success: true, data: newCourse });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const catId = Number(req.params.id);
        const courseId = Number(req.params.courseId);
        const cat = await Category.findOne({ id: catId });
        if (!cat) return res.status(404).json({ error: 'Category not found' });


        const course = cat.courses.find(c => Number(c.id) === courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });


        if (req.file) {
            const result = await uploadBufferToCloudinary(req.file.buffer, `categories/${catId}/courses`);
            course.image = result.secure_url;
        }


        ['name', 'description', 'duration', 'price', 'image'].forEach(field => {
            if (req.body[field]) course[field] = req.body[field];
        });


        await cat.save();
        res.json({ success: true, data: course });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteCourse = async (req, res) => {
    try {
        const catId = Number(req.params.id);
        const courseId = Number(req.params.courseId);
        const cat = await Category.findOne({ id: catId });
        if (!cat) return res.status(404).json({ error: 'Category not found' });


        const before = cat.courses.length;
        cat.courses = cat.courses.filter(c => Number(c.id) !== courseId);
        if (cat.courses.length === before) return res.status(404).json({ error: 'Course not found' });


        await cat.save();
        res.json({ success: true, message: 'Course removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};