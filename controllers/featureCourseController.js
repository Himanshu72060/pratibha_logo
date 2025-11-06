const FeatureCourse = require('../models/featureCourseModel');

// POST: Create new course
exports.createFeatureCourse = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }

        const newCourse = await FeatureCourse.create({
            name: req.body.name,
            description: req.body.description,
            duration: req.body.duration,
            price: req.body.price,
            image: req.file.path || req.file.url,
        });

        res.status(201).json({
            success: true,
            message: "Feature course created successfully",
            data: newCourse
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET all courses
exports.getAllFeatureCourses = async (req, res) => {
    try {
        const courses = await FeatureCourse.find();
        res.json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET one by ID
exports.getFeatureCourseById = async (req, res) => {
    try {
        const course = await FeatureCourse.findById(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });
        res.json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT: Update
exports.updateFeatureCourse = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) updateData.image = req.file.path || req.file.url;

        const updated = await FeatureCourse.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Course not found" });

        res.json({ success: true, message: "Course updated successfully", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE
exports.deleteFeatureCourse = async (req, res) => {
    try {
        const deleted = await FeatureCourse.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Course not found" });

        res.json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
