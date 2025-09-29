// controllers/courseController.js
const Course = require('../models/Course');
const { cloudinary } = require('../config/cloudinaryConfig');

// helper to upload buffer to Cloudinary
const uploadBufferToCloudinary = (buffer, folder = 'courses') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
};

// @desc Create course
exports.createCourse = async (req, res, next) => {
    try {
        const { categoryName, category, title, description, duration, price } = req.body;

        if (!categoryName || !category || !title) {
            return res.status(400).json({ success: false, message: 'categoryName, category, and title are required' });
        }

        const course = new Course({ categoryName, category, title, description, duration, price });

        if (req.files) {
            if (req.files.imageCategory && req.files.imageCategory[0]) {
                const file = req.files.imageCategory[0];
                const result = await uploadBufferToCloudinary(file.buffer, 'courses/imageCategory');
                course.imageCategory = { url: result.secure_url, public_id: result.public_id };
            }
            if (req.files.image && req.files.image[0]) {
                const file = req.files.image[0];
                const result = await uploadBufferToCloudinary(file.buffer, 'courses/image');
                course.image = { url: result.secure_url, public_id: result.public_id };
            }
        }

        await course.save();
        res.status(201).json({ success: true, data: course });
    } catch (err) {
        next(err);
    }
};

// @desc Get all courses
exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.json({ success: true, count: courses.length, data: courses });
    } catch (err) {
        next(err);
    }
};

// @desc Get single course
exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.json({ success: true, data: course });
    } catch (err) {
        next(err);
    }
};

// @desc Update course
exports.updateCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        const { categoryName, category, title, description, duration, price } = req.body;

        if (categoryName !== undefined) course.categoryName = categoryName;
        if (category !== undefined) course.category = category;
        if (title !== undefined) course.title = title;
        if (description !== undefined) course.description = description;
        if (duration !== undefined) course.duration = duration;
        if (price !== undefined) course.price = price;

        if (req.files && req.files.imageCategory && req.files.imageCategory[0]) {
            if (course.imageCategory && course.imageCategory.public_id) {
                await cloudinary.uploader.destroy(course.imageCategory.public_id);
            }
            const file = req.files.imageCategory[0];
            const result = await uploadBufferToCloudinary(file.buffer, 'courses/imageCategory');
            course.imageCategory = { url: result.secure_url, public_id: result.public_id };
        }

        if (req.files && req.files.image && req.files.image[0]) {
            if (course.image && course.image.public_id) {
                await cloudinary.uploader.destroy(course.image.public_id);
            }
            const file = req.files.image[0];
            const result = await uploadBufferToCloudinary(file.buffer, 'courses/image');
            course.image = { url: result.secure_url, public_id: result.public_id };
        }

        await course.save();
        res.json({ success: true, data: course });
    } catch (err) {
        next(err);
    }
};

// @desc Delete course
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        if (course.image && course.image.public_id) {
            await cloudinary.uploader.destroy(course.image.public_id);
        }
        if (course.imageCategory && course.imageCategory.public_id) {
            await cloudinary.uploader.destroy(course.imageCategory.public_id);
        }

        await course.deleteOne();
        res.json({ success: true, message: 'Course deleted' });
    } catch (err) {
        next(err);
    }
};
